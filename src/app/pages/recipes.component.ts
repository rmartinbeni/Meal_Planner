import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

type Ingredient = { id: number; name: string };

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="display:flex;gap:8px;margin-bottom:12px">
      <a routerLink="/">Semana</a>
      <a routerLink="/recipes">Recetas</a>
      <a routerLink="/ingredients">Ingredientes</a>
    </nav>

    <h2>Recetas</h2>

    <section style="margin-bottom:16px">
      <h3>Crear receta</h3>
      <label>
        Nombre: <input [value]="name()" (input)="name.set($any($event.target).value)" />
      </label>
      <br />
      <label>
        Ingredientes:
        <select (change)="toggleIngredient($any($event.target).value)" aria-label="Agregar ingrediente">
          <option value="">— selecciona —</option>
          <option *ngFor="let ing of ingredients()" [value]="ing.id">{{ ing.name }}</option>
        </select>
      </label>
      <div>
        Ingredientes seleccionados: <span *ngFor="let i of selectedIngredientsArray()">{{ i }} </span>
      </div>
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
  private readonly supabase = inject(SupabaseService).client;

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<{ id: number; name: string }[]>([]);
  readonly name = signal('');
  readonly selectedIngredients = signal<number[]>([]);

  get selectedIngredientsArray() {
    return () => this.selectedIngredients();
  }

  async ngOnInit() {
    await this.loadIngredients();
    await this.loadRecipes();
  }

  async loadIngredients() {
    const { data, error } = await this.supabase.from('ingredients').select('id, name');
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async loadRecipes() {
    const { data, error } = await this.supabase.from('recipes').select('id, name');
    if (error) return console.error(error);
    this.recipes.set((data as any) || []);
  }

  toggleIngredient(idStr: string) {
    const id = Number(idStr);
    if (!id) return;
    this.selectedIngredients.update(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  }

  async createRecipe() {
    const toInsert = {
      name: this.name(),
      ingredient_ids: this.selectedIngredients(),
    };
    const { error } = await this.supabase.from('recipes').insert([toInsert]);
    if (error) return console.error('Error creating recipe', error);
    this.name.set('');
    this.selectedIngredients.set([]);
    await this.loadRecipes();
  }
}
