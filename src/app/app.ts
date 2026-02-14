import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('menu-semanal');
  protected readonly menuItems = [
    { label: 'Semana', icon: 'pi pi-calendar', routerLink: '/' },
    {
      label: 'Recetas', icon: 'pi pi-book', routerLink: '/recipes'
    },
    { label: 'Ingredientes', icon: 'pi pi-tags', routerLink: '/ingredients' },
  ];
}
