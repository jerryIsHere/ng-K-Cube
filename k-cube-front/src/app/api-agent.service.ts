import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
class searchResources {
  search: (params: any) => Observable<any>
  constructor(
    public agent: ApiAgentService,
    public name: string,) {
    this.search = (params) => {
      return this.agent.http.get(this.agent.backend + name, { params: params })
    }
  }
}
class crudResources {
  get: (id: string, params: any) => Observable<any>
  post: (params: any, body: any) => Observable<any>
  put: (id: string, params: any, body: any) => Observable<any>
  delete: (id: string, params: any) => Observable<any>
  patch: (id: string, params: any, body: any) => Observable<any>
  constructor(
    public agent: ApiAgentService,
    public name: string,
    isGetable: boolean,
    isPostable: boolean,
    isPutable: boolean,
    isDeletable: boolean,
    isPatchable: boolean,) {
    this.get = (id: string, params) => {
      if (!isGetable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.get(this.agent.backend + name + '/' + id, { params: params })
    }
    this.post = (params, body) => {
      if (!isPostable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.post(this.agent.backend + name + '/', body, { params: params })
    }
    this.put = (id: string, params, body) => {
      if (!isPutable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.put(this.agent.backend + name + '/' + id, body, { params: params })
    }
    this.delete = (id: string, params) => {
      if (!isDeletable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.delete(this.agent.backend + name + '/' + id, { params: params })
    }
    this.patch = (id: string, params, body) => {
      if (!isPatchable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.patch(this.agent.backend + name + '/' + id, body, { params: params })
    }
  }

}
@Injectable({
  providedIn: 'root'
})
export class ApiAgentService {
  backend = "http://127.0.0.1:5000/"
  contributor: crudResources = new crudResources(this, "contributor", true, true, true, true, false)
  contributors: searchResources = new searchResources(this, "contributors")
  course: crudResources = new crudResources(this, "course", true, true, true, true, false)
  courses: searchResources = new searchResources(this, "courses")
  entity: crudResources = new crudResources(this, "entity", true, true, true, true, false)
  entities: searchResources = new searchResources(this, "entities")
  graph: crudResources = new crudResources(this, "graph", true, true, true, true, false)
  graphs: searchResources = new searchResources(this, "graphs")
  relatipnship: crudResources = new crudResources(this, "relatipnship", true, true, true, true, false)
  relatipnships: searchResources = new searchResources(this, "relatipnships")
  schedule: crudResources = new crudResources(this, "schedule", true, true, true, true, false)
  schedules: searchResources = new searchResources(this, "schedules")
  teaching: crudResources = new crudResources(this, "teaching", true, true, true, true, false)
  teachings: searchResources = new searchResources(this, "teachings")
  triple: crudResources = new crudResources(this, "triple", true, true, true, true, false)
  triples: searchResources = new searchResources(this, "triples")
  constructor(public http: HttpClient,) {
  
  }
}

