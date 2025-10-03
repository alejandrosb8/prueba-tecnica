import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const found = await this.usersService.findById(user.userId);
    if (!found) return null;
    return { id: found.id, email: found.email };
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.usersService.remove(user.userId);
  }
}
