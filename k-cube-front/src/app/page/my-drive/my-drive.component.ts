import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';
import { AuthService } from 'src/app/user/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-my-drive',
  templateUrl: './my-drive.component.html',
  styleUrls: ['./my-drive.component.css']
})
export class MyDriveComponent implements OnInit {
  courses: Array<any> | null = null
  graphs: Array<any> | null = null
  selected_course: any | null = null
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public auth: AuthService) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('course_id')) {
        this.api.courses.search({ course_id: params.get('course_id'), person_id: this.auth.person_id }).then(result => {
          if (result.length > 0) {
            this.selected_course = result[0]
            this.api.graphs.search({ course_id: this.selected_course.course_id, person_id: 1 }).then(result => this.graphs = result)
          }
        })
      }
      else {
        this.api.courses.search({}).then(result => this.courses = result)
        this.selected_course = null
      }
    })
  }

}
