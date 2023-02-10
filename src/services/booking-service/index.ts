import { forbiddenError, notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository/room-repository";
import ticketRepository from "@/repositories/ticket-repository";

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

  const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!userEnrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(userEnrollment.id);
  
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote === true) throw forbiddenError();

  const checkRoom = await roomRepository.getRoomWithId(roomId);
  
  if (!checkRoom) {
    throw notFoundError();
  }

  const NumberOfAvailableRooms = await bookingRepository.countNumberOfBooking(roomId);
  
  if (NumberOfAvailableRooms >= checkRoom.capacity) {
    throw forbiddenError();
  }

  const queryResponse = await bookingRepository.createABooking(userId, roomId);

  if (!queryResponse) {
    throw notFoundError();
  }

  return queryResponse;
}

async function updateABooking(userId: number, roomId: number, bookingId: number) {
  if (!userId || !roomId || !bookingId) throw forbiddenError();

  const checkRoom = await roomRepository.getRoomWithId(roomId);

  if (!checkRoom) {
    throw notFoundError();
  }

  const NumberOfAvailableRooms = await bookingRepository.countNumberOfBooking(roomId);

  if (NumberOfAvailableRooms >= checkRoom.capacity) {
    throw forbiddenError();
  }

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
