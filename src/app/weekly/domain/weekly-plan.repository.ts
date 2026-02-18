import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { WeeklyPlan } from './weekly-plan.model';

export const WEEKLY_PLAN_REPOSITORY = new InjectionToken<WeeklyPlanRepository>('WeeklyPlanRepository');

export interface WeeklyPlanRepository {
  getAll(): Observable<WeeklyPlan[]>;
  findById(id: string): Observable<WeeklyPlan | undefined>;
  findByDateRange(start: Date, end: Date): Observable<WeeklyPlan[]>;
  create(plan: Omit<WeeklyPlan, 'id'>): Observable<WeeklyPlan>;
  update(plan: WeeklyPlan): Observable<WeeklyPlan>;
  delete(id: string): Observable<void>;
}
