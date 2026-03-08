import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyMeal } from '@app/weekly/domain/weekly-meal.model';
import { WeeklyService } from '@app/weekly/service/weekly.service';

import { WeeklyComponent } from './weekly.component';

describe('WeeklyComponent', () => {
  let component: WeeklyComponent;
  let fixture: ComponentFixture<WeeklyComponent>;
  let mockWeeklyService: { generateRandomWeek: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockWeeklyService = {
      generateRandomWeek: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [WeeklyComponent],
      providers: [{ provide: WeeklyService, useValue: mockWeeklyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('randomizeWeek', () => {
    it('should call weeklyService.generateRandomWeek and update data signal', async () => {
      const mockRandomData = [
        {
          meal: 'Breakfast',
          Monday: 'Pizza',
          Tuesday: 'Burger',
          Wednesday: 'Pasta',
          Thursday: 'Salad',
          Friday: 'Soup',
          Saturday: 'Steak',
          Sunday: 'Chicken',
        },
      ];
      mockWeeklyService.generateRandomWeek.mockResolvedValue(mockRandomData);

      await component.randomizeWeek();

      expect(mockWeeklyService.generateRandomWeek).toHaveBeenCalled();
      expect(component.data()).toEqual(mockRandomData);
    });

    it('should set isLoading to true while fetching and false when done', async () => {
      let resolvePromise!: (value: WeeklyMeal[]) => void;
      const promise = new Promise<WeeklyMeal[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockWeeklyService.generateRandomWeek.mockReturnValue(promise);

      const randomizePromise = component.randomizeWeek();

      expect(component.isLoading()).toBe(true);

      resolvePromise([]);
      await randomizePromise;

      expect(component.isLoading()).toBe(false);
    });
  });
});
