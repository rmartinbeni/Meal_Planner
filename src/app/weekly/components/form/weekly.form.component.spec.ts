import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyFormComponent } from './weekly.form.component';

describe('WeeklyFormComponent', () => {
  let component: WeeklyFormComponent;
  let fixture: ComponentFixture<WeeklyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeeklyFormComponent],
    });

    fixture = TestBed.createComponent(WeeklyFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipes', [
      { id: 1, name: 'Eggs' },
      { id: 2, name: 'Salad' },
      { id: 3, name: 'Steak' },
    ]);

    fixture.detectChanges();
  });

  it('should initialize with an empty week structure', () => {
    const state = component.assignments();

    expect(Object.keys(state).length).toBe(7);
    expect(state['Monday']).toEqual({ breakfast: undefined, lunch: undefined, dinner: undefined });
    expect(state['Sunday']).toEqual({ breakfast: undefined, lunch: undefined, dinner: undefined });
  });

  describe('setAssignment (nested object updates)', () => {
    it('should update a specific meal slot without mutating siblings', () => {
      component.setAssignment('Monday', 'breakfast', '1');

      let state = component.assignments();

      expect(state['Monday']?.breakfast).toBe(1);

      expect(state['Monday']?.lunch).toBeUndefined();
      expect(state['Monday']?.dinner).toBeUndefined();
      expect(state['Tuesday']?.breakfast).toBeUndefined();

      component.setAssignment('Monday', 'lunch', '2');
      state = component.assignments();

      expect(state['Monday']?.breakfast).toBe(1);
      expect(state['Monday']?.lunch).toBe(2);
      expect(state['Monday']?.dinner).toBeUndefined();
    });

    it('should set the slot to undefined when sending an empty string', () => {
      component.setAssignment('Tuesday', 'dinner', '3');
      expect(component.assignments()['Tuesday']?.dinner).toBe(3);

      component.setAssignment('Tuesday', 'dinner', '');

      expect(component.assignments()['Tuesday']?.dinner).toBeUndefined();
    });
  });
});
