import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  sideNav: MatSidenav | undefined;

  constructor() { }

}
