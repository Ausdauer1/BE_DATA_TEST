import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetService } from './get.service';
import { query } from 'express';

@Controller('player')
export class GetController {
    constructor(private readonly getService: GetService) {}

    @Get('search')
    async searchPlayer(@Query('name') name: string) {
        return this.getService.searchPlayer(name)
    }

    @Get('detail/:id')
    async playerDetail(@Param('id') id: number) {
        return this.getService.searchPlayerById(id)
    }

    @Get('hitter')
    async hitterRank() {
        return this.getService.getBatterRank()
    }

    @Get('pitcher')
    async pitcherRank() {
        return this.getService.getPictcherRank()
    }

    
}
