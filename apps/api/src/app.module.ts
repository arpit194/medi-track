import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ReportsModule } from './reports/reports.module'
import { ShareModule } from './share/share.module'
import { PrismaModule } from './prisma/prisma.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ReportsModule,
    ShareModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
