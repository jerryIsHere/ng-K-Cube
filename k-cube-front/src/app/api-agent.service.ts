import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
class crudResources {
  get: (a: any) => Promise<any>
  constructor(
    public agent: ApiAgentService,
    public name: string,
    isGetable: boolean,
    isPostable: boolean,
    isPutable: boolean,
    isDeletable: boolean,
    isPatchable: boolean,) {
    this.get = (body) => {
      if (!isGetable) throw new Error('get method on resources ' + name + ' is not allowed');
      return this.agent.http.get(this.agent.backend + name + '/', body).toPromise()
    }

    if (isPostable) {

    }
    if (isPutable) {

    }
    if (isDeletable) {

    }
    if (isPatchable) {

    }
  }

}
@Injectable({
  providedIn: 'root'
})
export class ApiAgentService {
  backend = "http://127.0.0.1:5000/"
  constructor(public http: HttpClient,) { }
}

