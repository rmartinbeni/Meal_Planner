import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipesService } from '@app/recipes/service/recipes.service';

import { RecipesFormComponent } from './recipes.form.component';

describe('RecipesFormComponent', () => {
  let component: RecipesFormComponent;
  let fixture: ComponentFixture<RecipesFormComponent>;
  let mockRecipesService: { create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRecipesService = {
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RecipesFormComponent],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    });

    fixture = TestBed.createComponent(RecipesFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('ingredients', [
      { id: 1, name: 'Tomato' },
      { id: 2, name: 'Cheese' },
      { id: 3, name: 'Basil' },
    ]);

    const dummyElement = document.createElement('input');
    dummyElement.id = 'recipe-name';
    document.body.append(dummyElement);

    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelector('#recipe-name')?.remove();
  });

  it('should create with required inputs', () => {
    expect(component).toBeTruthy();
    expect(component.ingredients().length).toBe(3);
  });

  describe('Ingredient Selection (Signals & Computed)', () => {
    it('should add and remove ingredient ids using toggleIngredient', () => {
      expect(component.selectedIngredients()).toEqual([]);

      component.toggleIngredient('2');
      expect(component.selectedIngredients()).toEqual([2]);

      component.toggleIngredient('3');
      expect(component.selectedIngredients()).toEqual([2, 3]);

      component.toggleIngredient('2');
      expect(component.selectedIngredients()).toEqual([3]);
    });

    it('should compute selectedIngredientNames correctly based on selected ids', () => {
      component.toggleIngredient('1');
      component.toggleIngredient('3');

      const names = component.selectedIngredientNames();
      expect(names).toEqual(['Tomato', 'Basil']);
    });
  });

  describe('createRecipe', () => {
    it('should successfully create recipe, emit output, and clear form', async () => {
      component.form.get('name')?.setValue('Pizza');
      component.toggleIngredient('1');
      component.toggleIngredient('2');

      mockRecipesService.create.mockResolvedValue({
        data: { id: 1, name: 'Pizza', ingredient_ids: [1, 2] },
        error: undefined,
      } as unknown);

      let emitted = false;
      component.recipeAdded.subscribe(() => {
        emitted = true;
      });
      const inputElement = document.querySelector<HTMLInputElement>('#recipe-name');
      if (inputElement === null) throw new Error('Missing input');
      const focusSpy = vi.spyOn(inputElement, 'focus');

      await component.createRecipe();

      expect(mockRecipesService.create).toHaveBeenCalledWith({
        name: 'Pizza',
        ingredient_ids: [1, 2],
      });

      expect(component.form.get('name')?.value).toBe('');
      expect(component.selectedIngredients()).toEqual([]);
      expect(component.liveMessage()).toBe('Recipe created');

      expect(emitted).toBe(true);
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should handle error when create recipe fails and NOT emit', async () => {
      component.form.get('name')?.setValue('Pizza');
      component.toggleIngredient('1');

      const errorMessage = { message: 'Database error' };
      mockRecipesService.create.mockResolvedValue({
        data: undefined,
        error: errorMessage,
      } as unknown);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        /* empty */
      });

      let emitted = false;
      component.recipeAdded.subscribe(() => {
        emitted = true;
      });

      await component.createRecipe();

      expect(consoleSpy).toHaveBeenCalledWith('Error creating recipe', errorMessage);
      expect(emitted).toBe(false);

      expect(component.form.get('name')?.value).toBe('Pizza');
      expect(component.selectedIngredients()).toEqual([1]);

      consoleSpy.mockRestore();
    });
  });
});
