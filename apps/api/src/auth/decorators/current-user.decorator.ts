import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { JwtPayload } from '../../common/types/jwt'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    return ctx.switchToHttp().getRequest<{ user: JwtPayload }>().user
  },
)
