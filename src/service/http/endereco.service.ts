import { Injectable } from '@angular/core';
import { EnderecoMod } from './../../models/endereco';

@Injectable()
export class EnderecoService {

  constructor() { }

  public calcularFrete(): number {
    return 0;
  }

  public editarEndereco(end: EnderecoMod) {

  }

}
