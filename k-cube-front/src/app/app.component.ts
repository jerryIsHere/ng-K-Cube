import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginFormComponent } from './form/login-form/login-form.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageThatNeedLogin = ['my-drive']
  navToggle = true
  person_id = null;
  user_name = null;
  constructor(public dialog: MatDialog, public router: Router) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let page: string = this.router.url.split('/')[this.router.url.split('/').length - 1]
        if (this.pageThatNeedLogin.includes(page) && this.person_id == null) {
          this.router.navigate([''])
        }
      }
    })
  }

  login() {
    const dialogRef: MatDialogRef<LoginFormComponent> = this.dialog.open(LoginFormComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.person_id = result[0].person_id
      this.user_name = result[0].name
    })
  }
  logout() {
    this.person_id = null
    this.user_name = null
  }
}
