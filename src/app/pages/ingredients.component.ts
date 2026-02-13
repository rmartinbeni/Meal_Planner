import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-ingredients',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <nav style="display:flex;gap:8px;margin-bottom:12px">
      <a routerLink="/">Semana</a>
      <a routerLink="/recipes">Recetas</a>
      <a routerLink="/ingredients">Ingredientes</a>
    </nav>

    <h2>Ingredientes</h2>

    <section style="margin-bottom:16px">
      <label for="ingredient-name">Nuevo ingrediente:</label>
      <input id="ingredient-name" [formControl]="form.controls.name" aria-describedby="ingredients-live" />
      <button (click)="add()">Añadir</button>
    </section>
    <div id="ingredients-live" aria-live="polite" class="visually-hidden">{{ liveMessage() }}</div>

    <section>
      <h3>Todos los ingredientes</h3>
      <ul>
        <li *ngFor="let ing of ingredients()">{{ ing.name }} (id: {{ ing.id }})</li>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  readonly ingredients = signal<{ id: number; name: string }[]>([]);
  readonly form = new FormGroup({ name: new FormControl('') });
  readonly liveMessage = signal('');

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const { data, error } = await this.supabase.getIngredients();
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async add() {
    const value = (this.form.get('name')?.value ?? '').toString().trim();
    if (!value) return;
    const { error } = await this.supabase.insertIngredient(value);
    if (error) return console.error(error);
    this.form.get('name')?.setValue('');
    await this.load();
    this.liveMessage.set('Ingrediente añadido');
    const el = document.getElementById('ingredient-name') as HTMLInputElement | null;
    el?.focus();
  }
}
