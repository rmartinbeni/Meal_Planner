import { TestBed } from '@angular/core/testing';
import { IngredientsRepository } from '@app/ingredients/repository/ingredients.repository';

import { IngredientsService } from './ingredients.service';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let mockRepo: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [IngredientsService, { provide: IngredientsRepository, useValue: mockRepo }],
    });

    service = TestBed.inject(IngredientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call repository getAll and return its result', async () => {
      const mockResult = { data: [{ id: 1, name: 'Tomato' }], error: undefined };
      mockRepo.getAll.mockResolvedValue(mockResult as unknown);

      const result = await service.getAll();

      expect(mockRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult as unknown);
    });
  });

  describe('create', () => {
    it('should call repository create with the correct payload', async () => {
      const mockResult = { data: { id: 2, name: 'Potato' }, error: undefined };
      mockRepo.create.mockResolvedValue(mockResult as unknown);

      const result = await service.create('Potato');

      expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Potato' });
      expect(result).toEqual(mockResult as unknown);
    });
  });
});
