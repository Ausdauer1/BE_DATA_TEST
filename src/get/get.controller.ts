import { Controller, Get, Query } from '@nestjs/common';
import { GetService } from './get.service';
import { query } from 'express';

@Controller('player')
export class GetController {
    constructor(private readonly getService: GetService) {}

    @Get('search')
    async searchPlayer(@Query('name') name: string) {
        return this.getService.searchPlayer(name)
    }
}
