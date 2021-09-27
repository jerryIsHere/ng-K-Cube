import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './user/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { NavBarService } from './util/nav-bar.service';
NavBarService
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNav: MatSidenav | undefined;
  pageThatNeedLogin = ['my-drive', 'graph-editor', 'schedule-deitor']
  navToggle = true
  constructor(public router: Router, public auth: AuthService, public nav: NavBarService, public cd: ChangeDetectorRef) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let page: string = this.router.url.split('/')[this.router.url.split('/').length - 1].split('?')[0]
        if (this.pageThatNeedLogin.includes(page) && !auth.isLogined) {
          this.router.navigate([''])
        }
      }
    })
  }

  ngOnInit() {
    this.nav.sideNav = this.sideNav
  }

  ngAfterViewInit() {
    this.sideNav?.open()
    this.cd.detectChanges()
  }
}
