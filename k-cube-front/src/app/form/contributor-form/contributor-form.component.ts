import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../../api-agent.service';

@Component({
  selector: 'app-contributor-form',
  templateUrl: './contributor-form.component.html',
  styleUrls: ['./contributor-form.component.css']
})
export class ContributorFormComponent implements OnInit {
  form: FormGroup | null = null
  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<ContributorFormComponent>,) {
    this.form = new FormGroup({
      name: new FormControl({ value: '', disabled: false }, Validators.required),
    })
  }

  ngOnInit(): void {
  }
  submitForm() {
    if (this.form?.valid) {
      let body = { ...this.form.value }
      this.api.contributor.post({},body).then((response) => {
        this.dialogRef.close(response)
      })

    }
  }

}
