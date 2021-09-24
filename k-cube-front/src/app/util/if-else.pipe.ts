import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ifElse'
})
export class IfElsePipe implements PipeTransform {

  transform(value: unknown, condition: boolean, elseValue: unknown): unknown {
    return condition ? value : elseValue;
  }

}
