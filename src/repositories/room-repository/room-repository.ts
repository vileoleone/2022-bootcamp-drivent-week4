import { prisma } from "@/config";

async function getRoomWithId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    },
    include: {
      Booking: true
    }
  });
}

const roomRepository = {
  getRoomWithId
};

export default roomRepository;
