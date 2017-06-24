import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})

/*
REFERENCE : https://www.reddit.com/r/Angular2/comments/4so1j7/how_to_set_locale_for_datepipe/
 */

export class DateFormatPipe implements PipeTransform {

  private format = 'YYYY-MM-DD HH:mm:ss';

  transform(value: string): string {
    if (value != null) {
      const momentDate = moment(new Date(value));
      if (momentDate.isValid()) {
        return momentDate.format(this.format);
      }
    }
    return value;
  }

  transformDate(value: Date): string {
    if (value != null) {
      const momentDate = moment(value);
      if (momentDate.isValid()) {
        return momentDate.format(this.format);
      } else {
        return value.toDateString();
      }
    }
    return '';
  }

}
