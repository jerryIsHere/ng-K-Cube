import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginFormComponent } from '../form/login-form/login-form.component';

interface Identity {
  person_id: string,
  user_name: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  identity: Identity | undefined
  constructor(public dialog: MatDialog,) {
    if (localStorage.getItem('identity')) this.identity = JSON.parse(localStorage.getItem('identity') as string)
  }
  login() {
    const dialogRef: MatDialogRef<LoginFormComponent> = this.dialog.open(LoginFormComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.identity = { person_id: result[0].person_id, user_name: result[0].name }
      localStorage.setItem('identity', JSON.stringify(this.identity))
    })
  }
  logout() {
    this.identity = undefined
    localStorage.removeItem('identity')
    location.reload();
  }
  public get isLogined() {
    return this.person_id != undefined
  }
  public get person_id() {
    return this.identity?.person_id
  }
  public get user_name() {
    return this.identity?.user_name
  }
}
