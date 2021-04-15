import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void): any {
		try {
			const [type, token] = req.headers.authorization.split(' ');
			if (type != 'Bearer') {
				res.json({ msg: 'not_login' });
				return;
			}
			const payload = jwt.verify(token, process.env.SECRET_KEY);
			req.headers.email = payload.email;
			next();
		} catch (err) {
			res.json({ msg: 'not_login' });
			return;
		}
		return;
	}
}
