import WebSocket from 'ws';
import { getSessionBySocket } from '../utils/session';
import { roomStore } from '../models/roomStore';
import { sessions } from '../db/inMemoryDb';
import type { Ship } from '../types/Ship';

function isHit(ship: Ship, x: number, y: number): boolean {
  for (let i = 0; i < ship.length; i++) {
    const sx = ship.direction === 'horizontal' ? ship.x + i : ship.x;
    const sy = ship.direction === 'vertical' ? ship.y + i : ship.y;
    if (sx === x && sy === y) return true;
  }
  return false;
}

export function handleAttack(ws: WebSocket, message: any) {
  const session = getSessionBySocket(ws);
  const { roomId, x, y } = message.data;

  if (!session) {
    return ws.send(JSON.stringify({
      type: 'error',
      data: { message: 'User not registered' },
      id: 0,
    }));
  }

  const room = roomStore.getRoom(roomId);
  if (!room) {
    return ws.send(JSON.stringify({
      type: 'error',
      data: { message: 'Room not found' },
      id: 0,
    }));
  }

  const opponent = room.roomUsers.find(u => u.index !== session.index);
  if (!opponent) {
    return ws.send(JSON.stringify({
      type: 'error',
      data: { message: 'Opponent not found' },
      id: 0,
    }));
  }

  const opponentShips: Ship[] = (room as any).ships?.[opponent.index] || [];
  let hit = opponentShips.some(ship => isHit(ship, x, y));

  for (const user of room.roomUsers) {
    const targetSession = sessions.get(user.index);
    if (targetSession) {
      targetSession.socket.send(JSON.stringify({
        type: 'attack_result',
        data: {
          attacker: session.index,
          x,
          y,
          hit,
        },
        id: 0,
      }));
    }
  }
}

export function handleRandomAttack(ws: WebSocket, message: any) {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  handleAttack(ws, {
    ...message,
    data: {
      ...message.data,
      x,
      y,
    },
  });
}
