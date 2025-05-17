import { WebSocket } from 'ws';
import { registerUser } from '../db/userStore.js';

export function handleRegistration(ws: WebSocket, message: any) {
  const { name, password } = message.data;

  const { user, errorText } = registerUser(name, password);

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
