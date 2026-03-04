import { TestBed } from '@angular/core/testing';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';

import { WeeklyService } from './weekly.service';

describe('WeeklyService', () => {
  let service: WeeklyService;
  let mockRepo: { getAll: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [WeeklyService, { provide: WeeklyRepository, useValue: mockRepo }],
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
});
