import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContributorFormComponent } from 'src/app/form/contributor-form/contributor-form.component';
import { CourseFormComponent } from 'src/app/form/course-form/course-form.component';
@Component({
  selector: 'app-developer-board',
  templateUrl: './developer-board.component.html',
  styleUrls: ['./developer-board.component.css']
})
export class DeveloperBoardComponent implements OnInit {
  contributors: Array<any> | null = null
  courses: Array<any> | null = null
  entities: Array<any> | null = null
  relationships: Array<any> | null = null
  constructor(public api: ApiAgentService, public dialog: MatDialog) {
    this.api.contributors.search({}).then(result => this.contributors = result)
    this.api.courses.search({}).then(result => this.courses = result)
    this.api.entities.search({}).then(result => this.entities = result)
    this.api.relatipnships.search({}).then(result => this.relationships = result)
  }

  ngOnInit(): void {
  }
  createContributor() {
    const dialogRef: MatDialogRef<ContributorFormComponent> = this.dialog.open(ContributorFormComponent)
    dialogRef.afterClosed().subscribe((result: any) => {
      this.api.contributors.search({}).then(result => this.contributors = result)
    })
  }
  deleteContributor(person_id: any) {
    this.api.contributor.delete(person_id, {}).then(result => {
      this.api.contributors.search({}).then(result => this.contributors = result)
    })
  }
  createCourse() {
    const dialogRef: MatDialogRef<CourseFormComponent> = this.dialog.open(CourseFormComponent)
    dialogRef.afterClosed().subscribe((result: any) => {
      this.api.courses.search({}).then(result => this.courses = result)
    })
  }
  deleteCourse(course_id: any) {
    this.api.course.delete(course_id, {}).then(result => {
      this.api.courses.search({}).then(result => this.contributors = result)
    })
  }
}
