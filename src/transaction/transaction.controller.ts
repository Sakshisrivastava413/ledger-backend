import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Response } from 'express';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() body, @Res() res: Response) {
    try {
      const transaction = await this.transactionService.createTransaction(body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  @Get()
  async getTransactions(
    @Res() res: Response,
    @Query('accountId') accountId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const transactions = await this.transactionService.getAllTransactions(
        accountId,
        startDate,
        endDate,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Transactions fetched successfully',
        data: transactions,
      });
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
