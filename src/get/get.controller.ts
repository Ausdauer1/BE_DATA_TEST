import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetService } from './get.service';
import { query } from 'express';

@Controller('player')
export class GetController {
    constructor(private readonly getService: GetService) {}

    @Get('search')
    async searchPlayer(@Query('name') name: string) {
        const decodedName = decodeURIComponent(name)
        console.log(decodedName)
        return this.getService.searchPlayer(decodedName)
    }

    @Get('detail')
    async playerDetail(@Query('id') id: number) {
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
