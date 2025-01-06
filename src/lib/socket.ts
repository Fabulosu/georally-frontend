import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
	if (!socket) {
		socket = io('http://192.168.0.107:3000', {
			autoConnect: false
		});
		socket.connect();
	}
	return socket;
}
