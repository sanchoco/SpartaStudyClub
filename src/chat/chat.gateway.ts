import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(81)
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('send_msg')
	handleEvent(client: any, data: any): void {
		let result = {
			event: 'callback_msg',
			data: {
				nickname: data.nickname,
				message: data.message,
				date: data.date,
				conn_count: this.server.clients.size
			}
		};
		this.server.clients.forEach((otherClient) => {
			otherClient.send(JSON.stringify(result));
		});
	}
}
