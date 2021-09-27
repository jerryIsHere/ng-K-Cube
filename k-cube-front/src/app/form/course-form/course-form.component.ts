import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../../api-agent.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  form: FormGroup | undefined
  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<CourseFormComponent>,) {
    this.form = new FormGroup({
      course_name: new FormControl({ value: '', disabled: false }, Validators.required),
      course_code: new FormControl({ value: '', disabled: false }, Validators.required),
    })
  }

  ngOnInit(): void {
  }
  submitForm() {
    if (this.form?.valid) {
      let body = { ...this.form.value }
      this.api.entities.search({ 'name': body.course_code }).then(result => {
        if (result.length > 0) {
          body.entity_id = result[0].entity_id
          this.api.course.post({}, body).then((response) => {
            this.dialogRef.close(response)
          })
        }
        else {
          this.api.entity.post({}, { 'name': body.course_code }).then(result => {
            body.entity_id = result.entity_id
            this.api.course.post({}, body).then((response) => {
              this.dialogRef.close(response)
            })
          })
        }
      })

    }
  }
}
