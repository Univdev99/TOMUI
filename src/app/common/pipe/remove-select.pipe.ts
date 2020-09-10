import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removeSelect'
})
export class RemoveSelect implements PipeTransform {
    transform(value) {
        if (value === 'select') {
            return ''
        } else {
            return value;
        }

    }
}