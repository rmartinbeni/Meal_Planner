import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { RecipesService } from '@app/recipes/service/recipes.service';

import { RecipesComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  let mockRecipesService: { getAll: ReturnType<typeof vi.fn> };
  let mockIngredientsService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRecipesService = {
      getAll: vi.fn(),
    };
    mockIngredientsService = {
      getAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RecipesComponent],
    });

    TestBed.overrideComponent(RecipesComponent, {
      set: {
        providers: [
          { provide: RecipesService, useValue: mockRecipesService },
          { provide: IngredientsService, useValue: mockIngredientsService },
        ],
      },
    });

    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit (Smart Component Data Loading)', () => {
    it('should load ingredients and recipes automatically and populate signals', async () => {
      const mockIngredients = [{ id: 1, name: 'Tomato' }];
      const mockRecipes = [{ id: 1, name: 'Salad', ingredient_ids: [1] }];

      mockIngredientsService.getAll.mockResolvedValue({ data: mockIngredients, error: undefined });
      mockRecipesService.getAll.mockResolvedValue({ data: mockRecipes, error: undefined });

      await component.loadIngredients();
      await component.loadRecipes();

      expect(mockIngredientsService.getAll).toHaveBeenCalled();
      expect(mockRecipesService.getAll).toHaveBeenCalled();

      expect(component.ingredients()).toEqual(mockIngredients);
      expect(component.recipes()).toEqual(mockRecipes);
    });

    it('should handle errors gracefully without crashing if services fail', async () => {
      const errorMessage = { message: 'Network error' };
      mockIngredientsService.getAll.mockResolvedValue({ data: undefined, error: errorMessage });
      mockRecipesService.getAll.mockResolvedValue({ data: undefined, error: errorMessage });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        /* empty */
      });

      await component.loadIngredients();
      await component.loadRecipes();

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      expect(component.ingredients()).toEqual([]);
      expect(component.recipes()).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe('UI State Toggles', () => {
    it('should change isFormVisible signal when calling showForm()', () => {
      expect(component.isFormVisible()).toBe(false);
      component.showForm();
      expect(component.isFormVisible()).toBe(true);
    });
  });
});
