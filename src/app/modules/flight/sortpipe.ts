import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByOfferedPrice'
})
export class SortByOfferedPricePipe implements PipeTransform {
  transform(list: any[]): any[] {
    return list?.slice().sort((a, b) => a.Fare.OfferedPrice - b.Fare.OfferedPrice);
  }
}
