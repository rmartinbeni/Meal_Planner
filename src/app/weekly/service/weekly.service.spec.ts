import { TestBed } from '@angular/core/testing';
import { RecipesService } from '@app/recipes/service/recipes.service';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';

import { WeeklyService } from './weekly.service';

describe('WeeklyService', () => {
  let service: WeeklyService;
  let mockRepo: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let mockRecipesService: { getRandom: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      create: vi.fn(),
    };
    mockRecipesService = {
      getRandom: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WeeklyService,
        { provide: WeeklyRepository, useValue: mockRepo },
        { provide: RecipesService, useValue: mockRecipesService },
      ],
    });

    service = TestBed.inject(WeeklyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const mockResult = { data: [], error: undefined };
      mockRepo.getAll.mockResolvedValue(mockResult);

      const result = await service.getAll();

      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('should map payload and call repository create', async () => {
      const payload = {
        name: 'Week 1',
        assignments: {
          Monday: { breakfast: 1, lunch: undefined, dinner: 2 },
        },
      } as unknown as Omit<import('@app/weekly/domain/weekly-plan.model').WeeklyPlan, 'id'>;
      const mockResult = { data: { id: 10, ...payload }, error: undefined };
      mockRepo.create.mockResolvedValue(mockResult);

      const result = await service.create(payload);

      expect(mockRepo.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('generateRandomWeek', () => {
    it('should generate a randomized week calling RecipesService.getRandom', async () => {
      const mockRecipes = [
        { id: 1, name: 'Pizza' },
        { id: 2, name: 'Burger' },
      ];
      mockRecipesService.getRandom.mockResolvedValue({ data: mockRecipes, error: undefined });

      const result = await service.generateRandomWeek();

      expect(mockRecipesService.getRandom).toHaveBeenCalledWith(15);
      expect(result.length).toBe(3); // Breakfast, Lunch, Dinner

      const firstMeal = result[0];
      expect(firstMeal).toBeDefined();
      if (firstMeal) {
        expect(firstMeal.meal).toBe('Breakfast');
        expect(['Pizza', 'Burger']).toContain(firstMeal.Monday);
      }
    });

    it('should return empty array if getRandom fails', async () => {
      mockRecipesService.getRandom.mockResolvedValue({
        data: undefined,
        error: { message: 'error' },
      });
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      const result = await service.generateRandomWeek();

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalled();
      mockConsoleError.mockRestore();
    });
  });
});
