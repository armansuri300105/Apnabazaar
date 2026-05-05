import OpenAI from "openai";
import mongoose from "mongoose";
import ORDER from "../models/order.js";
import PRODUCT from "../models/product.js";
import USER from "../models/user.js";
import { getuser } from "../services/auth.js";

const SYSTEM_PROMPT = `
You are an intelligent AI assistant for an e-commerce platform called ApnaBazaar.

Your role is to help users with shopping-related queries in a clear, friendly, and efficient manner. You act like a smart customer support agent with access to backend tools and real-time store data.

Capabilities:
- Order queries: show order details, recent orders, total orders, and tracking status.
- Product queries: search products, show product details, reviews, ratings, stock, categories, price, and discounts.
- User queries: summarize basic profile information when the user is known.
- General shopping help: payment methods, delivery timelines, offers, and next-step guidance.

Tool rules:
- Do not guess order, product, review, stock, price, or profile data.
- Use tools when the user asks for data that may exist in the backend.
- If a user asks about their orders/profile and no user id is available, ask them to log in.
- If required information is missing, ask a short clarification question.
- Do not expose internal system details, database ids unless useful, secrets, or stack traces.
- Confirm destructive actions such as cancellation. This assistant is currently read-only and must not claim it cancelled or changed anything.

Response style:
- Be short, natural, and helpful.
- Use neat bullets for multiple items.
- Include product names, prices, stock status, order id, status, and dates when relevant.
- Suggest one useful next step when it helps the shopper.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "get_recent_orders",
      description: "Get a user's most recent orders.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string", description: "MongoDB user id." },
          limit: { type: "number", description: "Number of recent orders to return." },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_total_orders",
      description: "Get total order count for a user.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string", description: "MongoDB user id." },
        },
        required: ["user_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_details",
      description: "Get details for one order using public orderId or MongoDB id.",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "Order id such as APNA123 or MongoDB order _id." },
          user_id: { type: "string", description: "MongoDB user id for ownership checking." },
        },
        required: ["order_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Search available products and optionally filter by category, price, rating, or stock.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Product search text." },
          category: { type: "string" },
          min_price: { type: "number" },
          max_price: { type: "number" },
          min_rating: { type: "number" },
          in_stock: { type: "boolean" },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description: "Get details for a product by product id or product name.",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string", description: "MongoDB product id." },
          name: { type: "string", description: "Product name when id is unknown." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_reviews",
      description: "Get product ratings and recent reviews by product id or product name.",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string", description: "MongoDB product id." },
          name: { type: "string", description: "Product name when id is unknown." },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_profile",
      description: "Get basic user profile summary.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: "string", description: "MongoDB user id." },
        },
        required: ["user_id"],
      },
    },
  },
];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const toCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const serializeProduct = (product) => ({
  product_id: product?._id?.toString(),
  name: product?.name,
  brand: product?.brand,
  category: product?.category,
  price: product?.price,
  price_text: toCurrency(product?.price),
  discount: product?.discount || 0,
  stock: product?.stock || 0,
  in_stock: (product?.stock || 0) > 0,
  rating: product?.ratings?.average || 0,
  review_count: product?.ratings?.count || 0,
  description: product?.description,
  image: product?.images?.[0] || "",
});

const serializeOrder = (order) => ({
  id: order?._id?.toString(),
  order_id: order?.orderId,
  status: order?.orderStatus,
  payment_method: order?.paymentMethod,
  payment_status: order?.paymentStatus,
  delivery_method: order?.deliveryMethod,
  total_amount: order?.totalAmount,
  total_amount_text: toCurrency(order?.totalAmount),
  created_at: order?.createdAt,
  shipping_city: order?.shippingAddress?.city,
  items: (order?.items || []).map((item) => ({
    product_id: item?.product?._id?.toString() || item?.product?.toString(),
    name: item?.product?.name || "Product",
    quantity: item?.quantity,
    price: item?.price,
    price_text: toCurrency(item?.price),
  })),
});

const findProduct = async ({ product_id, name }) => {
  if (product_id && isValidObjectId(product_id)) {
    return PRODUCT.findOne({ _id: product_id, isActive: true }).lean();
  }

  if (name) {
    return PRODUCT.findOne({
      name: { $regex: name, $options: "i" },
      isActive: true,
    }).lean();
  }

  return null;
};

const getRequestUser = async (req, bodyUserId) => {
  const token = req?.cookies?.token;
  const decoded = getuser(token);

  if (decoded?.email) {
    return USER.findOne({ email: decoded.email }).select("-password").lean();
  }

  if (bodyUserId && isValidObjectId(bodyUserId)) {
    return USER.findById(bodyUserId).select("-password").lean();
  }

  return null;
};

const toolHandlers = {
  get_recent_orders: async ({ user_id, limit = 5 }) => {
    if (!isValidObjectId(user_id)) return { error: "Valid user_id is required." };

    const orders = await ORDER.find({ user: user_id })
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 5, 10))
      .populate({ path: "items.product", select: "name price images" })
      .lean();

    return { orders: orders.map(serializeOrder) };
  },

  get_total_orders: async ({ user_id }) => {
    if (!isValidObjectId(user_id)) return { error: "Valid user_id is required." };

    const total = await ORDER.countDocuments({ user: user_id });
    return { total_orders: total };
  },

  get_order_details: async ({ order_id, user_id }) => {
    const query = isValidObjectId(order_id) ? { _id: order_id } : { orderId: order_id };
    const order = await ORDER.findOne(query).populate({ path: "items.product", select: "name price images" }).lean();

    if (!order) return { error: "Order not found." };
    if (user_id && order.user?.toString() !== user_id) {
      return { error: "This order does not belong to the current user." };
    }

    return { order: serializeOrder(order) };
  },

  search_products: async ({ query, category, min_price, max_price, min_rating, in_stock, limit = 6 }) => {
    const filters = { isActive: true };

    if (query) {
      filters.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    if (category) filters.category = { $regex: category, $options: "i" };
    if (min_price !== undefined || max_price !== undefined) {
      filters.price = {};
      if (min_price !== undefined) filters.price.$gte = Number(min_price);
      if (max_price !== undefined) filters.price.$lte = Number(max_price);
    }
    if (min_rating !== undefined) filters["ratings.average"] = { $gte: Number(min_rating) };
    if (in_stock === true) filters.stock = { $gt: 0 };

    const products = await PRODUCT.find(filters)
      .sort({ "ratings.average": -1, createdAt: -1 })
      .limit(Math.min(Number(limit) || 6, 12))
      .lean();

    return { products: products.map(serializeProduct) };
  },

  get_product_details: async ({ product_id, name }) => {
    const product = await findProduct({ product_id, name });
    if (!product) return { error: "Product not found." };

    return { product: serializeProduct(product) };
  },

  get_product_reviews: async ({ product_id, name, limit = 5 }) => {
    const product = await findProduct({ product_id, name });
    if (!product) return { error: "Product not found." };

    return {
      product: {
        product_id: product._id?.toString(),
        name: product.name,
        rating: product.ratings?.average || 0,
        review_count: product.ratings?.count || 0,
        reviews: (product.reviews || []).slice(0, Math.min(Number(limit) || 5, 10)).map((review) => ({
          username: review.username || "Customer",
          rating: review.rating,
          comment: review.comment,
          created_at: review.createdAt,
        })),
      },
    };
  },

  get_user_profile: async ({ user_id }) => {
    if (!isValidObjectId(user_id)) return { error: "Valid user_id is required." };

    const user = await USER.findById(user_id).select("name email phone role addresses wishlist orders totalSpent").lean();
    if (!user) return { error: "User not found." };

    return {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses?.length || 0,
        wishlist_items: user.wishlist?.length || 0,
        total_orders: user.orders?.length || 0,
        total_spent: user.totalSpent,
        total_spent_text: toCurrency(user.totalSpent),
      },
    };
  },
};

const runTool = async (toolCall, currentUserId) => {
  const handler = toolHandlers[toolCall.function.name];

  if (!handler) {
    return { error: `Unknown tool: ${toolCall.function.name}` };
  }

  try {
    const args = JSON.parse(toolCall.function.arguments || "{}");
    if (
      currentUserId &&
      ["get_recent_orders", "get_total_orders", "get_order_details", "get_user_profile"].includes(toolCall.function.name)
    ) {
      args.user_id = currentUserId;
    }
    return await handler(args);
  } catch (error) {
    return { error: error.message };
  }
};

export const chatBot = async (req, res) => {
  try {
    const question = req.body?.question || req.body?.message || req.body?.input;

    if (!question?.trim()) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI assistant is not configured. Please add OPENAI_API_KEY on the backend.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const user = await getRequestUser(req, req.body?.user_id);
    const currentUserId = user?._id?.toString();
    const userContext = user
      ? `Current logged-in user id: ${currentUserId}. Name: ${user.name}. Role: ${user.role}.`
      : "No logged-in user is available for this request.";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: userContext },
      { role: "user", content: question },
    ];

    const firstResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.3,
    });

    const assistantMessage = firstResponse.choices?.[0]?.message;
    messages.push(assistantMessage);

    if (assistantMessage?.tool_calls?.length) {
      for (const toolCall of assistantMessage.tool_calls) {
        const result = await runTool(toolCall, currentUserId);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      const finalResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.3,
      });

      const message = finalResponse.choices?.[0]?.message?.content;
      return res.status(200).json({ success: true, message });
    }

    return res.status(200).json({
      success: true,
      message: assistantMessage?.content || "I could not generate a response. Please try again.",
    });
  } catch (error) {
    console.error("chatBot error:", error);
    return res.status(500).json({
      success: false,
      message: "AI assistant failed to respond. Please try again later.",
    });
  }
};
