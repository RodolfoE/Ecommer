import { Injectable, EventEmitter, Output } from '@angular/core';
import { ClienteMod } from '../../models/cliente';
import { HttpResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { FormatarstringService } from './../formatarstring.service'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { CompraMod } from './../../models/compra';
import { ProdutoMod } from './../../models/produto'
import { CarrinhoMod } from '../../models/carrinho';


@Injectable()
export class ClienteService {
  domain: string = 'http://localhost:3000';
  mCliente: ClienteMod;
  mTodosOsClientes: ClienteMod[];
  @Output() emmiter: EventEmitter<ClienteMod> = new EventEmitter();

  constructor(private http: HttpClient) {
    //this.getAllClients();
   }
   //,'authorization': 'Bearer ' + token
  fzrLogin(cliente){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.domain + '/cli/login', JSON.stringify(cliente), httpOptions)
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )      
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
    return null;// new ErrorObservable('Algo de errado não está certo. Por favor, tente novamente mais tarde.');
  };

   
  public initCliente(cliente){
    localStorage.setItem('currentUser', JSON.stringify(cliente));
    this.emmiter.emit();
  }

  
  public uploadFotoPerfil(idUsuarioMongo: string, fd: FormData, file: File) : Observable<any>{
    fd.append('FotoDePerfilDoUsuario', file, file.name);
    fd.append('idUsuarioMongo', idUsuarioMongo != null && idUsuarioMongo != undefined ? idUsuarioMongo : '');
    return this.http.post(this.domain + '/cli/addFotoPerfil', fd, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )
  }

  public buscarEnderecoCliente(coordinate){
    return this.http.get(this.domain + '/cli/obterEnderecoDoUsuario/' + JSON.stringify(coordinate))
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )
  }
  
  public teste(){
    return this.http.get(this.domain + '/cli/testar')
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )
  }
  
  public apagarRegistroCliente(id: string){
    return this.http.delete(this.domain + '/cli/apagarRegistroDoPerfil/' + id)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )
  }

  public deslogarCliente(){
    localStorage.removeItem('currentUser');
    this.emmiter.emit();
  }

  public getAllClients(){
    this.getClientes().subscribe(param => {
      this.mTodosOsClientes = param;
    })
  }

  private getClientes() : Observable<ClienteMod[]> {
    return this.http.get<ClienteMod>(this.domain + '/cli/clientes')
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ClienteMod[]>res)
      )  
    
  }

  getClienteById(id):ClienteMod{
    let aux: ClienteMod;
    this.mTodosOsClientes.forEach(param =>{
      if (param._id == id){ 
        aux = param;
      }
    });
    if (aux != null){
      return aux;
    }
    return null;
  }



  checarExistenciaDeUsuario(nomeUsuario: string){
    return this.http.get(this.domain + '/cli/nomeUsuarioEmUso/' + nomeUsuario)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)
      )  
  }

  checarExistenciaDeEmail(email: string){
    return this.http.get(this.domain + '/cli/verificarExistenciaDeEmail/' + email)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)
      )  
  }

  addCliente(idClienteNoMongo: string, Cliente: ClienteMod) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(this.domain + '/cli/cadastro_cliente/' + idClienteNoMongo, JSON.stringify(Cliente), httpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
        ,map(res => res)
      )
      
      ;
  }

  public saveClientData(cliente: ClienteMod){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.domain + '/cli/update_cliente', JSON.stringify(cliente), httpOptions)
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)
      )  
  }

  public exibirHistoricoDeCompra(): CompraMod {
    return null;
  }

  public exibirHistoricoDeCompraPorData(ascen: boolean): CompraMod {
    return null;
  }

  public exibirProdutosDestePerfil(): ProdutoMod[] {
    return null;
  }

  public addNovaCompra(compra: CompraMod) {

  }
}
