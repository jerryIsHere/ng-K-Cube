import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ApiAgentService } from 'src/app/api-agent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NavBarService } from 'src/app/util/nav-bar.service';
import { DatePipe } from '@angular/common';
import { depthOfNode, treeize, depthOfTree, angularTree } from 'src/app/script/graph';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TripleFormComponent } from 'src/app/form/triple-form/triple-form.component';
import { Observable, Observer } from 'rxjs';
NavBarService
@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})
export class GraphEditorComponent implements OnInit {
  @ViewChild('echarts') echarts: ECharts | undefined;
  public graph: any = null
  public triples: Array<any> | undefined
  public entities: Array<any> | undefined
  public relationships: Array<any> | undefined
  public options: EChartsOption = {}
  public course_entity_id: string | undefined
  public paths: Array<{ text: string, route: string, query: any }> = [{ text: 'My drive', route: '/my-drive/', query: {} }]
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
    let rootPromise = this.api.courses.search({ course_id: this.graph.course_id }).then(result => {
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
        edgeLength: 50
      },
      center: [30, 15],
      zoom: 0.01,
      draggable: true,
      roam: 'scale',
    }
    this.options = {
      series: series,
      tooltip: {}

    }
  }
  selectTriple(triple_id: string | number) {
    this.selectedContent = { triple_id: triple_id };
    if (this.tripleFormDialogRef) this.tripleFormDialogRef.close(null)
    this.tripleFormDialogRef = this.tripleDialogue()
    this.tripleFormDialogRef.afterClosed().subscribe((result: any) => {
    })
  }
  selectedContent: { head_entity_id?: string | number, tail_entity_id?: string | number, triple_id?: string | number, } = {}
  clickGraph(params: any) {
    console.log(params);
    if (params.dataType == "node") {
      if (!this.selectedContent.head_entity_id) {
        this.selectedContent = { head_entity_id: params.data.id }
        if (this.tripleFormDialogRef) this.tripleFormDialogRef.close(null)
        this.tripleFormDialogRef = undefined
      }
      else if (this.selectedContent.head_entity_id != params.data.id) {
        let duplicatedTriples: Array<any> | undefined = this.triples?.filter(t =>
          (t.head_entity == this.selectedContent.head_entity_id || t.head_entity == params.data.id) &&
          (t.tail_entity == this.selectedContent.head_entity_id || t.tail_entity == params.data.id)
        )
        if (duplicatedTriples && duplicatedTriples.length > 0) {
          this.tripleFormDialogRef?.close(null)
          this.tripleFormDialogRef = undefined
          this.selectTriple(duplicatedTriples[0].triple_id)
          this.highlightSelected()
          return
        }
        this.selectedContent.tail_entity_id = params.data.id;
        this.tailSelectionEvent.emit(this.selectedContent.tail_entity_id)
      }
      if (!this.tripleFormDialogRef) {
        this.tripleFormDialogRef = this.tripleDialogue()
        this.tripleFormDialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.addTriple(result)
          }
        })
      }
    }
    else if (params.dataType == "edge") {
      this.selectTriple(params.data.data.id)
    }
    this.highlightSelected()
  }
  unSelectAll() {
    this.selectedContent = {};
    ((this.options.series as any).links as Array<any>).forEach((element: any, index: number) => {

      element.lineStyle.opacity = 1

    });
    ((this.options.series as SeriesOption).data as Array<any>).forEach((element: any, index: number) => {
      element.itemStyle.opacity = 1
    })
    this.echarts?.setOption(this.options)
    this.tripleFormDialogRef = undefined
  }
  highlightSelected() {
    ((this.options.series as SeriesOption).data as Array<any>).forEach((element: any) => {
      if (element.id == this.selectedContent.head_entity_id
        || element.id == this.selectedContent.tail_entity_id) {
        element.itemStyle.opacity = 1
      }
      else {
        element.itemStyle.opacity = 0.25
      }
    });
    ((this.options.series as any).links as Array<any>).forEach((element: any, index: number) => {
      if (element.data.id == this.selectedContent.triple_id) {
        element.lineStyle.opacity = 1
      }
      else {
        element.lineStyle.opacity = 0.25
      }
    })
    this.echarts?.setOption(this.options)
  }
  addTriple(triple: any) {
    console.log(triple)
    let promises = []
    let newEntityNeeded = !((this.options.series as SeriesOption).data as Array<any>).map(node => node.id).includes(triple.head_entity) ||
      !((this.options.series as SeriesOption).data as Array<any>).map(node => node.id).includes(triple.tail_entity)
    if (newEntityNeeded) {
      promises.push(this.api.entities.search({}).then(result => {
        this.entities = result
      }))
    }
    Promise.all(promises).then(_ => {
      this.api.triples.search({ graph_id: this.graph.graph_id }).then(tr => {
        this.triples = tr
        if (this.triples)
          this.plot_graph(this.course_entity_id as string,
            this.triples.map(t => [t.head_entity, t.relationship, t.tail_entity]))
      })
    })
  }
  tripleFormDialogRef: MatDialogRef<TripleFormComponent> | undefined
  tripleDialogue(): MatDialogRef<TripleFormComponent> {
    let dialogRef = this.dialog.open(TripleFormComponent, {
      disableClose: true, hasBackdrop: false, data: {
        editor: this
      },
      position: {
        right: '2vw',
        bottom: '2vw'
      }
    })
    this.tripleFormDialogRef = dialogRef
    return this.tripleFormDialogRef

  }
  tailSelectionEvent: EventEmitter<string | number> = new EventEmitter()
}

