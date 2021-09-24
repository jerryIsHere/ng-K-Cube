import { Pipe, PipeTransform } from '@angular/core';

export function nestedAccess(objs: Array<unknown>, mappingKey: Array<string>): Array<any> {
  let result: Array<any> = []
  objs.map((o: any) => o[mappingKey[0]]).forEach(e => result.push(...e))
  mappingKey.shift()
  return mappingKey.length > 0 ? nestedAccess(result, mappingKey) : result
}
@Pipe({
  name: 'flatMap',
  pure: false
})
export class FlatMapPipe implements PipeTransform {

  transform(objs: Array<unknown> | null, mappingKey: Array<string> | null): null | Array<any> {
    if (objs == null) return null;
    if (mappingKey == null) return objs;
    return nestedAccess(objs, mappingKey);
  }

}