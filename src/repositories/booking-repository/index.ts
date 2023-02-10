import { prisma } from "@/config";

async function findFirst(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    }
  });
}

async function createABooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId, 
      roomId
    } 
  });
}

async function countNumberOfBooking(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId
    }
  });  
}

async function deleteABooking(bookingId: number) {
  return await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });  
}

async function updateABooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId
    }
  });
}

async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId
    }
  });
}

const bookingRepository = {
  findFirst,
  createABooking, 
  countNumberOfBooking,
  findBookingById,
  deleteABooking,
  updateABooking
};

export default bookingRepository;
