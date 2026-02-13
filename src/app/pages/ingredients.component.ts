import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="display:flex;gap:8px;margin-bottom:12px">
      <a routerLink="/">Semana</a>
      <a routerLink="/recipes">Recetas</a>
      <a routerLink="/ingredients">Ingredientes</a>
    </nav>

    <h2>Ingredientes</h2>

    <section style="margin-bottom:16px">
      <label>
        Nuevo ingrediente: <input [value]="name()" (input)="name.set($any($event.target).value)" />
      </label>
      <button (click)="add()">Añadir</button>
    </section>

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
  private readonly supabase = inject(SupabaseService).client;

  readonly ingredients = signal<{ id: number; name: string }[]>([]);
  readonly name = signal('');

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const { data, error } = await this.supabase.from('ingredients').select('id, name');
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async add() {
    const value = this.name().trim();
    if (!value) return;
    const { error } = await this.supabase.from('ingredients').insert([{ name: value }]);
    if (error) return console.error(error);
    this.name.set('');
    await this.load();
  }
}
