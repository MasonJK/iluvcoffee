import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Patch, Delete, Query} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffee')
export class CoffeeController {
    constructor(private readonly coffeeService: CoffeeService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const { limit, offset } = paginationQuery;
        return this.coffeeService.findAll(paginationQuery)
    }

    // @Get(':id')
    // findOne(@Param('id') id: string){
    //     return this.coffeeService.findOne(id)
    // }
    @Get(':id')
    findOne(@Param('id') id: number){
        // console.log(typeof id)
        return this.coffeeService.findOne('' + id)
    }

    @Post()
    // @HttpCode(HttpStatus.GONE)
    create(@Body() createCoffeeDto : CreateCoffeeDto){
        // console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeeService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto : UpdateCoffeeDto){
        return this.coffeeService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id : string){
        return this.coffeeService.remove(id)
    }
}
