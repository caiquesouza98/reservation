import express from "express";
import bodyParser from "body-parser";
import reservationRoutes from "./routes/reservation.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(bodyParser.json());
app.use("/reservas", reservationRoutes);
app.use(errorHandler);

export default app;
