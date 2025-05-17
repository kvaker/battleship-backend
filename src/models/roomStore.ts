type PlayerInfo = {
  name: string;
  index: number | string;
};

type Room = {
  roomId: number | string;
  roomUsers: PlayerInfo[];
};

let rooms: Room[] = [];
let nextRoomId = 1;

export const roomStore = {
  createRoom(player: PlayerInfo): Room {
    const room: Room = {
      roomId: nextRoomId++,
      roomUsers: [player],
    };
    rooms.push(room);
    return room;
  },

  getAvailableRooms(): Room[] {
    return rooms.filter(room => room.roomUsers.length === 1);
  },

  getAll(): Room[] {
    return rooms;
  },
};
