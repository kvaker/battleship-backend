import { WebSocket } from 'ws';
import { registerUser } from '../db/userStore.js';
import { sessions } from '../db/inMemoryDb';

export function handleRegistration(ws: WebSocket, message: any) {
  const { name, password } = message.data;
  const { user, errorText } = registerUser(name, password);

  if (user && !errorText) {
    sessions.set(user.index, {
      name: user.name,
      index: user.index,
      socket: ws,
    });
  }

  const response = {
    type: 'reg',
    data: {
      name,
      index: user?.index ?? null,
      error: !!errorText,
      errorText: errorText || '',
    },
    id: 0,
  };

  ws.send(JSON.stringify(response));
}

