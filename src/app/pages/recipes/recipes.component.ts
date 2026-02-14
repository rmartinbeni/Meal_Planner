import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

type Ingredient = { id: number; name: string };

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<{ id: number; name: string }[]>([]);
  readonly form = new FormGroup({ name: new FormControl('') });
  readonly selectedIngredients = signal<number[]>([]);
  readonly liveMessage = signal('');

  readonly selectedIngredientNames = computed(() => {
    const ids = this.selectedIngredients();
    const allIngs = this.ingredients();
    return ids
      .map((id) => allIngs.find((i) => i.id === id)?.name)
      .filter(Boolean) as string[];
  });

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
    this.selectedIngredients.update((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
