import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import expressSession from "express-session";
import morgan from "morgan";
import passport from "passport";
import swaggerUI from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";

if (process.env.NODE_ENV !== "production") config();

// OAuth Passport Strategies. Should come after the config() call.

/** Express app */
export const app = express();

// ==============================
// Middlewares
// ==============================

app.use(morgan("tiny")); // Log requests to the console
app.use(cors({ origin: process.env.FRONTEND_BASE_URL, credentials: true })); // Enable CORS
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(express.json()); // for parsing incoming data
app.use(express.urlencoded({ extended: true })); // parses incoming requests with urlencoded payloads
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(passport.initialize());
app.use(
    expressSession({
        secret: process.env.COOKIE_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.session());

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// ==============================
// Routes
// ==============================

app.get("/api/test", function testRoute(req, res) {
    res.status(200).json({ message: "Knightfall is online." });
});

app.all("*", function handleRemainingRoute(req, res) {
    return res.status(404).json({
        message: `Cannot find ${req.originalUrl} on this server!`,
    });
});
