import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { DataSource } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';

describe('CoffeeService', () => {
  let service: CoffeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
        { provide: getRepositoryToken(Event), useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
