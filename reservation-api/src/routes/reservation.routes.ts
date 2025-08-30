import { Router } from "express";
import reservationController from "../controllers/reservation.controller";

const router = Router();

router.post("/", (req, res, next) => reservationController.create(req, res, next));
router.get("/", (req, res, next) => reservationController.list(req, res, next));
router.delete("/:id", (req, res, next) => reservationController.cancel(req, res, next));

export default router;
