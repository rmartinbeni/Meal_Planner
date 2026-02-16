import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'meal-planner-root',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('weekly-menu');
  protected readonly menuItems = [
    { label: 'Week', icon: 'pi pi-calendar', routerLink: '/' },
    {
      label: 'Recipes',
      icon: 'pi pi-book',
      routerLink: '/recipes',
    },
    { label: 'Ingredients', icon: 'pi pi-tags', routerLink: '/ingredients' },
  ];
}
