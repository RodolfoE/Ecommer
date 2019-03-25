import { Injectable } from '@angular/core';

@Injectable()
export class FormatarstringService {

  constructor() { }

  public formatarFiltroUrl(filtros: string[]) {
    var fullString = '';
    for (let i = 0; i < filtros.length; i++) {
      if (i < filtros.length - 1) {
        fullString += filtros[i] + '+';
      } else {
        fullString += filtros[i];
      }
    }
    return fullString;
  }

}
