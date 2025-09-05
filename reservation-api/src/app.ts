import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import reservationRoutes from "./routes/reservation.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import errorHandler from "./middlewares/errorHandler";
import limiter from "./middlewares/rateLimiter";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(bodyParser.json());

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser())
app.use(limiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/reservas", reservationRoutes);
app.use(errorHandler);

export default app;
