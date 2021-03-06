import { Component, OnInit } from '@angular/core';

import { ApiAgentService } from 'src/app/api-agent.service';
@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent implements OnInit {
  courses: Array<any> | undefined
  searchingString: string = ''
  constructor(public api: ApiAgentService) {
    this.api.courses.search({}).then(result => this.courses = result)
  }

  ngOnInit(): void {
  }

}
