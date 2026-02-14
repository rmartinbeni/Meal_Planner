import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/weekly.component').then(m => m.WeeklyComponent) },
  { path: 'recipes', loadComponent: () => import('./pages/recipes.component').then(m => m.RecipesComponent) },
  { path: 'ingredients', loadComponent: () => import('./pages/ingredients.component').then(m => m.IngredientsComponent) },
];
