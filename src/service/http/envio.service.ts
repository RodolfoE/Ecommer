import { Injectable } from '@angular/core';
import { CompraMod } from './../../models/compra';
import { catchError, retry } from 'rxjs/operators';
import { ProdutoMod } from './../../models/produto';
import { ClienteMod } from './../../models/cliente';
import { EnvioMod } from './../../models/envio';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class EnvioService {
  domain: string = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  public gerarNovoEnvio(idCompra: string){
    let env = new EnvioMod();
    env.isEntrege = false;
    env.isPostadoAoCorreio = false;
    env.mResponsavelPelaEntrega = 'Não Atribuido';
    env.mResponsavelPelaPostagem = 'Não Atribuido';
    env.idCompra = idCompra;
    this.addEnvioNoMongo(env).subscribe(param =>{
      console.log(param);
    })
  }

  private addEnvioNoMongo(env: EnvioMod){
    return this.http.post<EnvioMod>(this.domain + '/env/envio', env)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <CompraMod[]>res)
      )
  }

  public confirmarChegada() {

  }

  public estornarEnvioPorTroca(nomeResponsavel: string, compra: CompraMod, produtoAntigo: ProdutoMod, produtoNovo: ProdutoMod) {
    //postar novo produto a ser enviado, postar chegada de um produto e marcar responsável!
  }

  public estornoSimples() {
    //só aguardar o produto chegar e enviar o dinheiro para o cliente.
  }

  public exibirTdsEnvios() {

  }

  public exibirEnviosPorData(asnc: boolean) {

  }

  public exibirEnviosPorCliente(client: ClienteMod) {

  }

  public exibirEnviosPorIntervaloDeData(dataInicial: Date, dataFinal: Date) {

  }

  public exibirEnviosEmAberto() {

  }

  public postarEnvioAoCorreio(responsavel: string) {

  }

  public confirmarPostagemAoCorreio() {

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return null; // new ErrorObservable('Algo de errado não está certo. Por favor, tente novamente mais tarde.');
  };

}
