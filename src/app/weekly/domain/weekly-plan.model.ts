export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Meal {
  recipeId: number;
}

export interface DailyPlan {
  day: DayOfWeek;
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snacks?: Meal[];
}

export interface WeeklyPlan {
  id: number;
  name: string;
  startDate: Date;
  days: DailyPlan[];
}
