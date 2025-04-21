import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuDto } from '../shared/dto/main-menu/main-menu.model';

@Component({
  selector: 'app-pages',
  imports: [CommonModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
  menus: Array<MainMenuDto> = [
    {
      label: 'User',
      path: 'users',
      isActive: true
    },
    {
      label: 'Menu',
      path: 'menus',
      isActive: false
    },
  ];
}
