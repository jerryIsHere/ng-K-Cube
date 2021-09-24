import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ifNotEqualElse'
})
export class IfNotEqualElsePipe implements PipeTransform {

  transform(value: unknown, compare: unknown, elseValue: unknown): unknown {
    return value != compare ? value : elseValue;
  }

}
