import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();


import authRoutes from './routes/auth.js'
import organizationRoutes from './routes/organizationRoutes.js'
import menusRoute from './routes/menus.js'
import tablesRoute from './routes/tables.js'

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173'];
// const allowedOrigins = ['https://toyshop.sbs', 'https://admin.toyshop.sbs'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // return the specific origin string
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
}
app.use(cors(corsOptions));

// app.use(cors({ origin: "*" })); // Allow all origins
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/test", (req, res, next) => {
    res.send("<h1>Welcome To Nodejs</h1>");
});
app.use("/api/gallery/", express.static("gallery", {
    maxAge: '1d',
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    }
}))
app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/menu',menusRoute)
app.use('/api/tables',tablesRoute)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        msg: err.msg,
        status: err.status,
        stack: err.stack,
    });
});

const conncetDB = () => {
    try {
        mongoose.connect(process.env.URI);
        console.log("Connecting Database...");
    } catch (error) {
        console.log("error", error);
    }
};
mongoose.connection.on("connected", () => {
    console.log("Database Connected Successful...");
});
mongoose.connection.on("disconnected", () => {
    console.log("database not connected...");
});
mongoose.set("strictQuery", true);
app.listen(port, () => {
    conncetDB();
    console.log(`Listening to ${port}`);
});