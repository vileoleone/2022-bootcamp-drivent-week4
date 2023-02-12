import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service/index";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getABooking(Number(userId));
    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedErro") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postABooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const bookingPost = await bookingService.postABooking(Number(userId), Number(roomId));
    res.status(httpStatus.OK).send(bookingPost);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedErro") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "forbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function putABooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const responseForUpdate = await bookingService.updateABooking(Number(userId), Number(roomId), Number(bookingId));
    res.status(httpStatus.OK).send( { bookingId: responseForUpdate.id } );
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedErro") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "forbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

