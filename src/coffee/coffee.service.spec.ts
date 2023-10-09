import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { DataSource, Repository } from 'typeorm';

// create a generic function that simply returns a mocked object with all the same methods that repository class provides
type MockRepository<T= any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>() : MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})


describe('CoffeeService', () => {
  let service: CoffeeService;

  // executed before each test. This is the setup phase
  // there is also, beforeAll, afterEach, afterAll functions.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
  });

  // represents individual test.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    // success path
    // If coffee with a specific ID exists, 
    describe('when coffee with ID exists', () => {
      // test if the method returns the coffee object, or in our case, the coffee entity
      it('should return the coffee object', async () => {
        const coffeeID = '1';
        const expectedCoffee = {};

        const coffee = await service.findOne(coffeeID);
        expect(coffee).toEqual(expectedCoffee)
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException', async () => {

      });
    });
  });
});
