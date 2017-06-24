import {Pipe, PipeTransform} from '@angular/core';
/**
 * Created by SAMPATH on 5/17/2017.
 */

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const enumMember in value) {
      if (parseInt(enumMember, 10) >= 0) {
        keys.push({key: enumMember, value: value[enumMember]});
      }
    }
    return keys;
  }
}
