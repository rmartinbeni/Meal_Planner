import { Routes } from '@angular/router';
import { WeeklyComponent } from './pages/weekly.component';
import { RecipesComponent } from './pages/recipes.component';
import { IngredientsComponent } from './pages/ingredients.component';

export const routes: Routes = [
	{ path: '', component: WeeklyComponent },
	{ path: 'recipes', component: RecipesComponent },
	{ path: 'ingredients', component: IngredientsComponent },
];
