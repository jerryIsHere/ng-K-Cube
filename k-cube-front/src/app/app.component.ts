import { Component } from '@angular/core';
import { AuthService } from './user/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageThatNeedLogin = ['my-drive']
  navToggle = true
  constructor(public router: Router, public auth:AuthService) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let page: string = this.router.url.split('/')[this.router.url.split('/').length - 1].split('?')[0]
        if (this.pageThatNeedLogin.includes(page) && !auth.isLogined) {
          this.router.navigate([''])
        }
      }
    })
  }

}
