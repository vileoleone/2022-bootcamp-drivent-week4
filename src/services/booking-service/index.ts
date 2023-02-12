import { forbiddenError, notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository/room-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { query } from "express";
import { check } from "prettier";

async function getABooking(userId: number) {
  if (!userId)
    throw unauthorizedError();

  const queryResponse = await bookingRepository.findFirst(userId);

  if (!queryResponse) {
    throw notFoundError();
  }

  return queryResponse;
}

async function postABooking(userId: number, roomId: number) {
  if (!userId) throw unauthorizedError();

  if (!roomId) throw notFoundError();

  const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!userEnrollment) throw forbiddenError();
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(userEnrollment.id);  
  
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) throw forbiddenError();

  const checkRoom = await roomRepository.getRoomWithId(roomId);

  if (!checkRoom) {
    throw notFoundError();
  }

  const NumberOfRoomsbooked = await bookingRepository.countNumberOfBooking(roomId);
  
  if (NumberOfRoomsbooked >= checkRoom.capacity) {
    throw forbiddenError();
  }

  const queryResponse = await bookingRepository.createABooking(userId, roomId);

  if (!queryResponse) {
    throw notFoundError();
  }

  return queryResponse;
}

async function updateABooking(userId: number, roomId: number, bookingId: number) {
  if (!userId || !roomId || !bookingId) throw new Error;

  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw notFoundError();
  }

  const checkRoom = await roomRepository.getRoomWithId(roomId);

  if (!checkRoom) {
    throw notFoundError();
  } 
 
  if (checkRoom.capacity === checkRoom.Booking.length) throw forbiddenError();
  
  const updateUserBooking = await bookingRepository.updateABooking(bookingId, roomId);
  
  if (!updateABooking) throw forbiddenError();
  return updateUserBooking; 
}

const bookingService = {
  getABooking,
  postABooking,
  updateABooking
};

export default bookingService;
