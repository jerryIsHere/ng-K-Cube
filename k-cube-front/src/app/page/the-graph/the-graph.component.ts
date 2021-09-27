import { Component, OnInit } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ApiAgentService } from 'src/app/api-agent.service';

@Component({
  selector: 'app-the-graph',
  templateUrl: './the-graph.component.html',
  styleUrls: ['./the-graph.component.css']
})
export class TheGraphComponent implements OnInit {
  triples: Array<any> | undefined
  entities: Array<any> | undefined
  relationships: Array<any> | undefined
  constructor(public api: ApiAgentService,) { this.get_data() }
  get_data() {
    let triplesPromise = this.api.triples.search({}).then(tr => {
      this.triples = tr
    })
    let entitiesPromise = this.api.entities.search({}).then(er => {
      this.entities = er
    })
    let relationshipsPromise = this.api.relationships.search({}).then(rr => {
      this.relationships = rr
    })
    Promise.all([triplesPromise, entitiesPromise, relationshipsPromise]).then(_ => {
      if (this.triples && this.entities)
        this.plot_graph(this.entities, this.triples)
    })
  }
  ngOnInit(): void {
  }
  options: EChartsOption = {}
  plot_graph(entities: Array<any>, triples: Array<any>) {
    let series: SeriesOption = {
      type: 'graph',
      layout: 'force',
      label: {
        show: true,
        formatter: '{b}'
      },
      tooltip: {
        formatter: (pa) => {
          return ''
        }
      },
      data: entities.map(entity => {
        return {
          category: 0,
          id: entity.entity_id + '', name: entity.name,
          symbolSize: 50,
        }
      }),
      links: triples.map(triple => {
        return {
          source: triple.head_entity + '',
          target: triple.tail_entity + '',
        }
      }).filter((triple, index, self) => {
        return self.findIndex(t => {
          return t.source == triple.source && t.target == triple.target
        }) == index
      }),
      categories: [{ name: 'none' }],
      force: {
        //initLayout: 'circular',
        repulsion: 100,
        gravity: 0.01,
        edgeLength: 100,
      },

      draggable: true,
    }
    this.options = {
      series: series,
      tooltip: {}

    }
    console.log(this.options)
  }
  clickGraph(params: any) {

  }
}
