import express, { urlencoded } from "express"
import user from "./routes/user.js"
import product from "./routes/product.js"
import order from "./routes/order.js"
import admin from "./routes/admin.js"
import vendor from "./routes/vendor.js"
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./connection/connection.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;
app.use(urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser())

app.use(cors({
    origin: ["https://apnabzaar.netlify.app", "https://apnabazaaradmin.netlify.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));


const url = process.env.MONGO_URL || "mongodb://localhost:27017/E-Commerce"

app.use('/api/user',user);
app.use('/api/product', product);
app.use('/api/order', order);
app.use('/api/admin', admin);
app.use('/api/vendor', vendor);

app.listen(PORT, () => {
    connect(url)
    console.log(`Server run on port ${PORT}`);
})