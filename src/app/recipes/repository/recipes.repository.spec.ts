import { TestBed } from '@angular/core/testing';
import { supabaseClient } from '@core/supabase/supabase.client';

import { RecipesRepository } from './recipes.repository';

describe('RecipesRepository', () => {
  let repository: RecipesRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipesRepository],
    });
    repository = TestBed.inject(RecipesRepository);
    vi.clearAllMocks();
  });

  describe('getRandom', () => {
    it('should return randomized array with limit', async () => {
      const mockData = [
        { id: 1, name: 'Recipe 1' },
        { id: 2, name: 'Recipe 2' },
        { id: 3, name: 'Recipe 3' },
      ];

      const selectMock = vi.fn().mockResolvedValue({ data: mockData, error: undefined });
      const fromSpy = vi
        .spyOn(supabaseClient, 'from')
        .mockReturnValue({ select: selectMock } as unknown as ReturnType<
          typeof supabaseClient.from
        >);

      const result = await repository.getRandom(2);

      expect(fromSpy).toHaveBeenCalledWith('recipes');
      expect(selectMock).toHaveBeenCalledWith('id, name');
      expect(result.error).toBeUndefined();
      expect(result.data).toHaveLength(2);
      expect(mockData).toEqual(expect.arrayContaining(result.data));
    });

    it('should handle errors gracefully', async () => {
      const mockError = { message: 'DB Error' };
      const selectMock = vi.fn().mockResolvedValue({ data: undefined, error: mockError });
      vi.spyOn(supabaseClient, 'from').mockReturnValue({
        select: selectMock,
      } as unknown as ReturnType<typeof supabaseClient.from>);

      const result = await repository.getRandom(2);

      expect(result.error).toEqual(mockError);
      expect(result.data).toEqual([]);
    });
  });
});
