import { getBooking, postABooking, putABooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRoute = Router();

bookingRoute
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", postABooking)
  .put("/:bookingId", putABooking);

export { bookingRoute };

