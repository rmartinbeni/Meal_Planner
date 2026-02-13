import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  protected readonly title = signal('menu-semanal');

  async ngOnInit() {
    try {
      // Replace 'your_table_name' with a real table name from your Supabase project
      const { data, error } = await this.supabaseService.client
        .from('recipes')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
      }

      console.log('Successfully connected to Supabase and fetched data:', data);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }
}
