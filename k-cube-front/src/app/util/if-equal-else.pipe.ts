import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ifEqualElse'
})
export class IfEqualElsePipe implements PipeTransform {

  transform(value: unknown, compare: unknown, elseValue: unknown): unknown {
    return value == compare ? value : elseValue;
  }

}
