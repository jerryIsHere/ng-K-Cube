import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})
export class GraphEditorComponent implements OnInit {
  graph = null
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('graph_id')) {
        this.api.courses.search({ graph_id: params.get('graph_id') }).then(result => {
          if (result.length > 0) {
            this.graph = result[0]
            return
          }
        })
      }
      this.router.navigate([''])
    })
  }


}
