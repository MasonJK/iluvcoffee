import { HttpException, Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from'src/events/entities/event.entity';

@Injectable()
export class CoffeeService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,

        private readonly dataSource: DataSource,
    ){}

    findAll(paginationQuery : PaginationQueryDto){
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: {
                flavors: true,
            },
            skip: offset,
            take: limit,
        })
    }

    async findOne(id : string){
        // throw 'A random error';
        const coffee = await this.coffeeRepository.findOne({ 
            where : { id: +id },
            relations: {
                flavors: true,
            }
        });
        if (!coffee){
            //throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND)
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    } 

    async create(createCoffeeDto: CreateCoffeeDto){
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))  
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee)
    }

    async update(id : string, updateCoffeeDto : UpdateCoffeeDto){
        const flavors = 
            updateCoffeeDto.flavors && (
                await Promise.all(
                    updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
            ));
        
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id : string){
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name : string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({ where : { name } });
        if (existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({ name });
    }

    async recommendCoffee(coffee: Coffee){
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect(); // new connection to the database
        await queryRunner.startTransaction();
        
        try{
            coffee.recommendation++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeID: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        }catch(err){
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    }
}
