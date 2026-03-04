import { TestBed } from '@angular/core/testing';
import { RecipesRepository } from '@app/recipes/repository/recipes.repository';

import { RecipesService } from './recipes.service';

describe('RecipesService', () => {
  let service: RecipesService;
  let mockRepo: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [RecipesService, { provide: RecipesRepository, useValue: mockRepo }],
    });

    service = TestBed.inject(RecipesService);
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
      const payload = { name: 'Pasta', ingredient_ids: [1, 2] };
      const mockResult = { data: { id: 1, ...payload }, error: undefined };
      mockRepo.create.mockResolvedValue(mockResult);

      const result = await service.create(payload);

      expect(mockRepo.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockResult);
    });
  });
});
