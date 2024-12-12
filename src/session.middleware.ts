import { Injectable, NestMiddleware } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class CheckSessionMiddleware implements NestMiddleware {
  private redisClient = createClient({ url: 'redis://:dangsan10@13.209.70.240:6379'});

  constructor() {
    this.redisClient.connect().catch(console.error);
  }

  async use(req: any, res: any, next: () => void) {
    if (req.session && req.session.user) {
      const sessionKey = `session:${req.sessionID}`; 
      console.log(req.session.user)
      const ttl = await this.redisClient.TTL(sessionKey); // Get session TTL

      if (ttl > 0) {
        console.log(`Session for user ${req.session.user.user} is active, TTL: ${ttl} seconds.`);
        next();
      } else {
        res.status(401).json({ message: 'Session expired or not valid' });
      }
    } else {
      res.status(401).json({ message: 'Session expired or not valid' });
    }
  }
}
