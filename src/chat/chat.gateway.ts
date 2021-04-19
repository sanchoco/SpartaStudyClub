import { InjectRepository } from '@nestjs/typeorm';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { Server } from 'ws';
import { SendMessageDto } from './dto/send-message.dto';
import { Chat } from './entities/chat.entity';

@WebSocketGateway(81)
export class ChatGateway {
	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		this.current();
		this.chatRepository.find({ order: { date: 'DESC' }, take:5 }).then((log) => {
			client.send(JSON.stringify({ event: 'before_msg', data: log.reverse() }));
		});
	}

	handleDisconnect(client: any) {
		this.current();
	}

	current = () => {
		return this.broadcast({
			event: 'current_visitor',
			data: { conn: this.server.clients.size }
		});
	};

	@SubscribeMessage('send_msg')
	handleEvent(client: any, data: SendMessageDto): void {
		if (!(data.nickname && data.message)) return;
		let message = {
			event: 'callback_msg',
			data: {
				nickname: data.nickname,
				message: data.message,
				date: Date.now()
			}
		};
		this.broadcast(message);
		try {
			this.intoDB(message.data);
		} catch {
			console.log('채팅 기록 DB 저장 에러');
		}
		return;
	}

	intoDB = async (data: Object) => {
		await this.chatRepository.insert(data);
	};

	broadcast(data: Object): void {
		this.server.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}
}
