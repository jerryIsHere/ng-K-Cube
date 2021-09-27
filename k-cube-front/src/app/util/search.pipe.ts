import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(objs: Array<any> | undefined, key: string | Array<string>, values: string): Array<any> {
    if (!objs) return []
    if (!values || values == '') return objs;
    if (typeof key === "string") return objs.filter((o: any) => (o[key as string] as string).includes(values))
    if (key instanceof Array) return objs.filter((o: any) => {
      for (let k of key) {
        return (o[k as string] as string).includes(values)
      }
      return false
    })
    return []

  }

}