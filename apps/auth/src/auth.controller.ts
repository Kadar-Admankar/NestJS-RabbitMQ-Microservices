import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext){
    const channel = context.getChannelRef()
    console.log('channel....', channel)
    const message = context.getMessage()
    console.log('message....', message)
    channel.ack(message)
      console.log('msg acknowledged')
    return { user: 'USER' }
  }
}
