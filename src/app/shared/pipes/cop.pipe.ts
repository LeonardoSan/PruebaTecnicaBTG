import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cop',
  standalone: true,
})
export class CopPipe implements PipeTransform {
  transform(value: number): string {
    return `COP $${value.toLocaleString('es-CO')}`;
  }
}
