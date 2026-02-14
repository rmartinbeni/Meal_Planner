import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/weekly/weekly.component').then(m => m.WeeklyComponent) },
  { path: 'recipes', loadComponent: () => import('./pages/recipes/recipes.component').then(m => m.RecipesComponent) },
  { path: 'ingredients', loadComponent: () => import('./pages/ingredients/ingredients.component').then(m => m.IngredientsComponent) },
];
