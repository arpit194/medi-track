import { Module } from '@nestjs/common'
import { ShareController } from './share.controller'
import { ShareService } from './share.service'
import { PrismaModule } from '../prisma/prisma.module'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
