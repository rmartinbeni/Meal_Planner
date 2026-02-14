import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';

@Component({
  selector: 'app-ingredients',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  private readonly ingredientsService = inject(IngredientsService);

  readonly ingredients = signal<{ id: number; name: string }[]>([]);
  readonly form = new FormGroup({ name: new FormControl('') });
  readonly liveMessage = signal('');

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const { data, error } = await this.ingredientsService.getAll();
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async add() {
    const value = (this.form.get('name')?.value ?? '').toString().trim();
    if (!value) return;
    const { error } = await this.ingredientsService.create(value);
    if (error) return console.error(error);
    this.form.get('name')?.setValue('');
    await this.load();
    this.liveMessage.set('Ingrediente añadido');
    const el = document.getElementById('ingredient-name') as HTMLInputElement | null;
    el?.focus();
  }
}
