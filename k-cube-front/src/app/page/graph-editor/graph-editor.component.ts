import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NavBarService } from 'src/app/util/nav-bar.service';
import { DatePipe } from '@angular/common';
import { depthOfNode, treeize, depthOfTree, angularTree } from 'src/app/script/graph';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TripleFormComponent } from 'src/app/form/triple-form/triple-form.component';
NavBarService
@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})
export class GraphEditorComponent implements OnInit {
  @ViewChild('echarts') echarts: ECharts | undefined;
  graph: any = null
  triples: Array<any> | undefined
  entities: Array<any> | undefined
  relationships: Array<any> | undefined
  options: EChartsOption = {}
  course_entity_id: string | undefined
  paths: Array<{ text: string, route: string, query: any }> = [{ text: 'My drive', route: '/my-drive/', query: {} }]
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute,
    public router: Router, public nav: NavBarService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.nav.sideNav?.close()
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('graph_id')) {
        this.api.graphs.search({ graph_id: params.get('graph_id') }).then(result => {
          if (result.length > 0) {
            this.graph = result[0]
            this.get_data(params.get('graph_id') + '')
          }
          else {
            this.router.navigate([''])
          }
        })
      }
      else {
        this.router.navigate([''])
      }
    })
  }
  course: any
  get_data(graph_id: string) {
    let rootPromise = this.api.courses.search({ graph_id: graph_id }).then(result => {
      this.course = result[0]
      this.course_entity_id = this.course.entity_id
      this.paths = [{ text: 'My drive', route: '/my-drive/', query: {} },
      { text: this.course.course_name, route: '/my-drive/', query: { course_id: this.course.course_id } },
      { text: (new DatePipe('en-US')).transform(this.graph?.create_datetime, 'short') as string, route: '/graph-editor/', query: { graph_id: this.graph.graph_id } }]
      if (result.length > 0) {
        let triplesPromise = this.api.triples.search({ graph_id: graph_id }).then(tr => {
          this.triples = tr
        })
        let entitiesPromise = this.api.entities.search({}).then(er => {
          this.entities = er
        })
        let relationshipsPromise = this.api.relationships.search({}).then(rr => {
          this.relationships = rr
        })
        Promise.all([triplesPromise, entitiesPromise, relationshipsPromise]).then(_ => {
          if (this.triples)
            this.plot_graph(this.course_entity_id as string,
              this.triples.map(t => [t.head_entity, t.relationship, t.tail_entity]))
        })
      }
    })
  }


  plot_graph(root_entity_id: string, triples: Array<Array<any>>) {
    let tree = treeize(triples, root_entity_id)
    let angles = new angularTree(tree)
    let radius = 2
    let setNode = (map: Map<string, any>, eid: string, category: number = 1) => {
      let rank = depthOfNode(eid, tree)
      let range = angles.childrenAngle(eid)
      let angle = (range[0] + range[1]) / 2
      let x = Math.cos(angle) * rank * radius / depthOfTree(tree)
      let y = Math.sin(angle) * rank * radius / depthOfTree(tree)
      map.set(eid, {
        category: category,
        id: eid + '',
        name: this.entities?.filter(e => e.entity_id == eid)[0].name,
        x: x,
        y: y,
        symbolSize: 100,
        itemStyle: {}
      })
    }
    let nodesMap: Map<string, any> = new Map()
    let links: Array<any> = []
    let categories: Array<any> = [{ name: 'root' }, { name: 'else' }]
    this.triples?.forEach(triple => {
      setNode(nodesMap, triple.head_entity)
      setNode(nodesMap, triple.tail_entity)
      links.push({
        source: triple.head_entity + '',
        target: triple.tail_entity + '',
        data: { id: triple.triple_id },
        lineStyle: { width: 5 }
      })
    })
    setNode(nodesMap, root_entity_id, 0)
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
      data: Array.from(nodesMap.values()),
      links: links,
      categories: categories,
      force: {
      },

      zoom: 0.01,
      draggable: true,
    }
    this.options = {
      series: series,
      tooltip: {}

    }
  }
  selectedTriple: { selected_entity_id?: string, triple_id?: string } | undefined
  clickGraph(params: any) {
    console.log(params);
    if (params.dataType == "node") {
      this.selectedTriple = { selected_entity_id: params.data.id };
      ((this.options.series as SeriesOption).data as Array<any>).forEach((element: any, index: number) => {
        if (index == params.dataIndex) {
          element.itemStyle.opacity = 1
        }
        else {
          element.itemStyle.opacity = 0.25
        }
      });
      ((this.options.series as any).links as Array<any>).forEach((element: any, index: number) => {
        element.lineStyle.opacity = 0.25
      })
      const dialogRef: MatDialogRef<TripleFormComponent> = this.dialog.open(TripleFormComponent, {
        disableClose: true, hasBackdrop: false, data: {
          selected_entity_id: this.selectedTriple.selected_entity_id,
          editor: this
        }
      })
      dialogRef.afterClosed().subscribe((result: any) => {
        this.unSelectAll()
        if (result) {
          this.addTriple(result)
        }
      })
    }
    else if (params.dataType == "edge") {
      this.selectedTriple = { triple_id: params.data.data.id };
      console.log
      console.log(this.selectedTriple);
      ((this.options.series as any).links as Array<any>).forEach((element: any, index: number) => {
        if (index == params.dataIndex) {
          element.lineStyle.opacity = 1
        }
        else {
          element.lineStyle.opacity = 0.25
        }
      });
      ((this.options.series as SeriesOption).data as Array<any>).forEach((element: any, index: number) => {
        element.itemStyle.opacity = 0.25
      })
      const dialogRef: MatDialogRef<TripleFormComponent> = this.dialog.open(TripleFormComponent, {
        disableClose: true, hasBackdrop: false, data: {
          triple_id: this.selectedTriple.triple_id,
          editor: this
        }
      })
      dialogRef.afterClosed().subscribe((result: any) => {
        this.unSelectAll()
        if (result) {
          location.reload()
        }
      })
    }
    this.echarts?.setOption(this.options)
  }
  unSelectAll() {
    this.selectedTriple = undefined;
    ((this.options.series as any).links as Array<any>).forEach((element: any, index: number) => {

      element.lineStyle.opacity = 1

    });
    ((this.options.series as SeriesOption).data as Array<any>).forEach((element: any, index: number) => {
      element.itemStyle.opacity = 1
    })
    this.echarts?.setOption(this.options)
  }
  addTriple(triple: any) {
    location.reload();
    (this.options.series as SeriesOption).data;
    (this.options.series as any).links
    this.echarts?.setOption(this.options)
  }
}

