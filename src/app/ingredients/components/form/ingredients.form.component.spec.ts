import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';

import { IngredientsFormComponent } from './ingredients.form.component';

describe('IngredientsFormComponent', () => {
  let component: IngredientsFormComponent;
  let fixture: ComponentFixture<IngredientsFormComponent>;
  let mockIngredientsService: { create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockIngredientsService = {
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [IngredientsFormComponent],
    });
    TestBed.overrideComponent(IngredientsFormComponent, {
      set: {
        providers: [{ provide: IngredientsService, useValue: mockIngredientsService }],
      },
    });

    fixture = TestBed.createComponent(IngredientsFormComponent);
    component = fixture.componentInstance;

    const dummyElement = document.createElement('input');
    dummyElement.id = 'ingredient-name';
    document.body.append(dummyElement);

    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelector('#ingredient-name')?.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add()', () => {
    it('should not add if value is empty', async () => {
      component.form.controls.name.setValue('   ');
      await component.add();
      expect(mockIngredientsService.create).not.toHaveBeenCalled();
    });

    it('should show error message if service fails', async () => {
      component.form.controls.name.setValue('Tomato');
      mockIngredientsService.create.mockResolvedValue({ error: 'Failed' });

      await component.add();

      expect(mockIngredientsService.create).toHaveBeenCalledWith('Tomato');
      expect(component.errorMessage()).toBe('Failed to add ingredient');
      expect(component.liveMessage()).toBe('');
    });

    it('should emit event, update signal, focus DOM and clear signal asynchronously on success', async () => {
      component.form.controls.name.setValue('Basil');
      mockIngredientsService.create.mockResolvedValue({ error: undefined });

      let emitted = false;
      component.ingredientAdded.subscribe(() => {
        emitted = true;
      });

      const inputElement = document.querySelector<HTMLInputElement>('#ingredient-name');
      if (inputElement === null) throw new Error('Missing input');
      const focusSpy = vi.spyOn(inputElement, 'focus');

      await component.add();
      fixture.detectChanges();

      expect(emitted).toBe(true);
      expect(component.liveMessage()).toBe('Ingredient added');
      expect(component.form.controls.name.value).toBe('');
      expect(focusSpy).toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 3100));
      fixture.detectChanges();

      expect(component.liveMessage()).toBe('');
    });
  });
});
