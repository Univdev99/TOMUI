import { ElementService } from './element/element.service';

export class CommonFunctions {
    constructor(private elementService?: ElementService) {

    }

    static getYear() {
        const currentYear = new Date().getFullYear();
        let yearArray = [];
        yearArray.push({ 'label': 'Select', 'value': 'select' });
        for (let year = 1950; year <= currentYear; year++) {
            yearArray.push({ 'label': year.toString(), 'value': year });
        }
        return yearArray;
    }

    static groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
}