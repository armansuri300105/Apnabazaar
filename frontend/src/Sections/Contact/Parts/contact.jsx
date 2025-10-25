import { useState } from "react";
import { sendCustomerQuery } from "../../../../API/api";
import Swal from "sweetalert2";

const initialForm = {
  name: "",
  email: "",
  category: "General Inquiry",
  subject: "",
  message: "",
};

const ContactUs = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // clear error for this field if user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ validation logic
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // show errors if validation fails

    setLoading(true);
    try {
      const res = await sendCustomerQuery(form);
      console.log(res)
      if (res?.data?.success){
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your message has been sent successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res?.data?.message || "Something went wrong!",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setForm(initialForm);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-section min-h-screen bg-white flex flex-col items-center py-10 px-4 mt-[110px] [@media(max-width:900px)]:mt-[150px]">
      <h2 className="text-3xl font-semibold text-center mb-2">Contact Us</h2>
      <p className="text-gray-600 text-center mb-8">
        Have a question or need help? We're here to support you. Choose the best way to reach us below.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl w-full">
        {/* Contact Form */}
        <form
          className="bg-white shadow rounded-xl p-8 flex-1"
          onSubmit={handleSubmit}
          noValidate
        >
          <h4 className="font-medium text-lg mb-4">Send us a Message</h4>

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Name *</label>
            <input
              type="text"
              name="name"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ${
                errors.name ? "border-red-500 ring-red-100" : "ring-gray-200"
              }`}
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ${
                errors.email ? "border-red-500 ring-red-100" : "ring-gray-200"
              }`}
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Category *</label>
            <select
              name="category"
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={form.category}
              onChange={handleChange}
            >
              <option>General Inquiry</option>
              <option>Vendor Support</option>
              <option>Customer Support</option>
            </select>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Subject *</label>
            <input
              type="text"
              name="subject"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ${
                errors.subject ? "border-red-500 ring-red-100" : "ring-gray-200"
              }`}
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief description of your inquiry"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-semibold">Message *</label>
            <textarea
              name="message"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring min-h-[100px] ${
                errors.message ? "border-red-500 ring-red-100" : "ring-gray-200"
              }`}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us more about your inquiry..."
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Info Sidebar */}
        <div className="bg-gray-50 shadow rounded-xl p-8 w-full lg:w-[360px] flex flex-col gap-8">
          <div>
            <h4 className="font-medium text-lg mb-2">Get in Touch</h4>
            <div className="mb-4">
              <div className="font-semibold">General Inquiries</div>
              <div className="text-sm text-gray-500 mb-1">
                Questions about our platform or services
              </div>
              <div className="font-mono text-sm text-gray-700">apnabazaarbussiness@gmail.com</div>
              <div className="text-xs text-gray-400">
                Response: <span className="font-medium text-gray-700">Within 24 hours</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-semibold">Vendor Support</div>
              <div className="text-sm text-gray-500 mb-1">
                Help for current and prospective vendors
              </div>
              <div className="font-mono text-sm text-gray-700">apnabazaarbussiness@gmail.com</div>
              <div className="text-xs text-gray-400">
                Response: <span className="font-medium text-gray-700">Within 12 hours</span>
              </div>
            </div>

            <div>
              <div className="font-semibold">Customer Support</div>
              <div className="text-sm text-gray-500 mb-1">
                Order issues, returns, or account help
              </div>
              <div className="font-mono text-sm text-gray-700">support@Apnabazaar.com</div>
              <div className="text-xs text-gray-400">
                Response: <span className="font-medium text-gray-700">Within 6 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;