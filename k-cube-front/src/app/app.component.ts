import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginFormComponent } from './form/login-form/login-form.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navToggle = true
  person_id = null;
  constructor(public dialog: MatDialog) {
  }

  login() {
    const dialogRef: MatDialogRef<LoginFormComponent> = this.dialog.open(LoginFormComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.person_id = result
    })
  }
  logout() {
    this.person_id = null
  }
}
