import { Pipe, PipeTransform } from '@angular/core';
import { nestedAccess } from './flat-map.pipe'
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(objs: Array<unknown> | null | undefined, key: any, values?: Array<unknown>, mappingKey?: Array<string>): null | Array<any> {
    if (!objs) return null;
    if (!values) return objs;
    if (typeof key == 'string') {
      if (Array.isArray(values)) {
        if (values.length == 0) return []
        return objs.filter((o: any) => {
          if (mappingKey) return nestedAccess(o, mappingKey).filter((e: any) => values.includes(e[key as string])).length > 0
          return values.includes(o[key as string])
        })
      }
      else {
        return objs.filter((o: any) => {
          if (mappingKey) return nestedAccess(o, mappingKey).filter((e: any) => e[key as string] == values).length > 0
          return o[key as string] == values
        })
      }
    }
    if (key instanceof Array) {
      if (key.length == 0) return objs
      let result = []
      for (let k of key) {
        if (Array.isArray(values)) {
          result.push(...objs.filter((o: any) => {
            if (mappingKey) return nestedAccess(o, mappingKey).filter((e: any) => values.includes(e[k])).length > 0
            return values.includes(o[k])
          }))
        }
        else {
          result.push(...objs.filter((o: any) => {
            if (mappingKey) return nestedAccess(o, mappingKey).filter((e: any) => e[k] == values).length > 0
            return o[k] == values
          }))
        }
      }
      return result.filter((v: any, i: any, a: Array<any>) => a.findIndex((t: any) => (t.id === v.id)) === i)
    }
    return null
  }

}