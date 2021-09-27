import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../../api-agent.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  form: FormGroup | undefined
  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<LoginFormComponent>,) {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: false }, Validators.required),
    })
  }

  ngOnInit(): void {
  }
  submitForm() {
    if (this.form?.valid) {
      let params = { ...this.form.value }
      this.api.contributors.search(params).then((response) => {
        if (response.length == 1)this.dialogRef.close(response)
      })

    }
  }

}
