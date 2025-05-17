import WebSocket from 'ws';
import { getSessionBySocket } from '../utils/session';
import { roomStore } from '../models/roomStore';
import { sessions } from '../db/inMemoryDb';

export function handleCreateRoom(ws: WebSocket, message: any) {
  const session = getSessionBySocket(ws);

  if (!session) {
    return ws.send(JSON.stringify({
      type: 'error',
      data: { message: 'User not registered' },
      id: 0,
    }));
  }

  roomStore.createRoom({ name: session.name, index: session.index });

  const availableRooms = roomStore.getAvailableRooms();

  for (const { socket } of sessions.values()) {
    socket.send(JSON.stringify({
      type: 'update_room',
      data: availableRooms,
      id: 0,
    }));
  }
}
