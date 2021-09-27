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
  courses: Array<any> | undefined
  graphs: Array<any> | undefined
  selected_course: any | undefined
  pathsDefault: Array<{ text: string, route: string, query: any }> = [{ text: 'My drive', route: '/my-drive/', query: {} }]
  paths: Array<{ text: string, route: string, query: any }> = []
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public auth: AuthService) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.paths = [this.pathsDefault[0]]
      if (params.get('course_id')) {
        this.api.courses.search({ course_id: params.get('course_id'), person_id: this.auth.person_id }).then(result => {
          if (result.length > 0) {
            this.selected_course = result[0]
            this.paths.push({ text: this.selected_course.course_name, route: '/my-drive/', query: { course_id: this.selected_course.course_id } })
            this.api.graphs.search({ course_id: this.selected_course.course_id, person_id: this.auth.person_id }).then(result => this.graphs = result)
          }
        })
      }
      else {
        this.graphs = undefined
        this.api.courses.search({}).then(result => this.courses = result)
        this.selected_course = null
      }
    })
  }
  createGraph() {
    this.api.graph.post({}, { person_id: this.auth.identity?.person_id, course_id: this.selected_course.course_id }).then(graph => {
      this.graphs?.push(graph)
    })
  }
}
