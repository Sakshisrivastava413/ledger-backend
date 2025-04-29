import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':id/balance')
  async getBalance(@Param('id') id: number) {
    return await this.accountService.getBalance(id);
  }
}
