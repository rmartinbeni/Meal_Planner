import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

type Ingredient = { id: number; name: string };

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <nav style="display:flex;gap:8px;margin-bottom:12px">
      <a routerLink="/">Semana</a>
      <a routerLink="/recipes">Recetas</a>
      <a routerLink="/ingredients">Ingredientes</a>
    </nav>

    <h2>Recetas</h2>

    <section style="margin-bottom:16px">
      <h3>Crear receta</h3>
      <label for="recipe-name">Nombre:</label>
      <input id="recipe-name" [formControl]="form.controls.name" aria-describedby="recipes-live" />
      <br />
      <label for="ingredient-select">Ingredientes:</label>
      <select id="ingredient-select" (change)="onToggleIngredient($event)" aria-label="Agregar ingrediente">
        <option value="">— selecciona —</option>
        <option *ngFor="let ing of ingredients()" [value]="ing.id">{{ ing.name }}</option>
      </select>
      <div>
        Ingredientes seleccionados: <span *ngFor="let i of selectedIngredientsArray()">{{ i }} </span>
      </div>
      <div id="recipes-live" aria-live="polite" class="visually-hidden">{{ liveMessage() }}</div>
      <button (click)="createRecipe()">Crear</button>
    </section>

    <section>
      <h3>Lista de recetas</h3>
      <ul>
        <li *ngFor="let r of recipes()">{{ r.name }} (id: {{ r.id }})</li>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<{ id: number; name: string }[]>([]);
  readonly form = new FormGroup({ name: new FormControl('') });
  readonly selectedIngredients = signal<number[]>([]);
  readonly liveMessage = signal('');

  get selectedIngredientsArray() {
    return () => this.selectedIngredients();
  }

  async ngOnInit() {
    await this.loadIngredients();
    await this.loadRecipes();
  }

  async loadIngredients() {
    const { data, error } = await this.supabase.getIngredients();
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async loadRecipes() {
    const { data, error } = await this.supabase.getRecipes();
    if (error) return console.error(error);
    this.recipes.set((data as any) || []);
  }

  toggleIngredient(idStr: string) {
    const id = Number(idStr);
    if (!id) return;
    this.selectedIngredients.update((prev: number[]) => (prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id]));
  }

  async createRecipe() {
    const toInsert = {
      name: (this.form.get('name')?.value ?? '').toString(),
      ingredient_ids: this.selectedIngredients(),
    };
    const { error } = await this.supabase.insertRecipe(toInsert);
    if (error) return console.error('Error creating recipe', error);
    this.form.get('name')?.setValue('');
    this.selectedIngredients.set([]);
    await this.loadRecipes();
    this.liveMessage.set('Receta creada');
    const el = document.getElementById('recipe-name') as HTMLInputElement | null;
    el?.focus();
  }

  onToggleIngredient(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.toggleIngredient(val);
  }
}
