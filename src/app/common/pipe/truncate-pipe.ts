import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatePipe'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 108, ellipsis = '...') {
    if(value) {
      return value.length > limit ? value.substr(0, limit) + ellipsis : value;
    } else {
      return '';
    }
  }
}