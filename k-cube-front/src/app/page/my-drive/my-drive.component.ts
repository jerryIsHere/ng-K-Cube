import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';

@Component({
  selector: 'app-my-drive',
  templateUrl: './my-drive.component.html',
  styleUrls: ['./my-drive.component.css']
})
export class MyDriveComponent implements OnInit {
  courses: Array<any> | null = null
  graphs: Array<any> | null = null
  constructor(public api: ApiAgentService) {
    
    this.api.courses.search({}).then(result => this.courses = result)
    this.api.graphs.search({}).then(result => this.graphs = result)
  }

  ngOnInit(): void {
  }

}
