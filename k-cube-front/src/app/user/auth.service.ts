import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginFormComponent } from '../form/login-form/login-form.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  person_id = null;
  user_name = null;
  constructor(public dialog: MatDialog,) { }
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
  public get isLogined() {
    return this.person_id != null
  }
}
