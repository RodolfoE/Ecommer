import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ClienteMod } from '../../models/cliente';
import { ProdutoMod } from '../../models/produto';
import { modalVisualizarCompra } from '../../models/modalVisualizarCompra';
import { FormatarstringService } from './../formatarstring.service'
import { catchError, retry } from 'rxjs/operators';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable()
export class ProdutosService {
  formatacao: FormatarstringService;
  domain: string = 'http://localhost:3000';
  @Output() test: EventEmitter<ProdutoMod[]> = new EventEmitter();
  public mProdutos: ProdutoMod[];
  public mTdsProdutos: ProdutoMod[];
  private observer: any;
  urlUpload: string;
  public uploader:FileUploader;

  constructor(private http: HttpClient) {
    this.formatacao = new FormatarstringService();
    this.mProdutos = [];
    this.mTdsProdutos = [];

    if (this.mProdutos.length <= 0){
      this.getAllProducts();
    }
    this.urlUpload = this.domain + '/prod/upload';
    this.uploader = new FileUploader({url: this.urlUpload, itemAlias: 'photo'});
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
  };
  }

  public updateProducts() {
    this.test.emit(this.mProdutos);
  }

  public listarTdsProdutos() {

  }

  editProd(prod: ProdutoMod, action: string){
    return this.http.put(this.domain + '/prod/' + action+ '/' + prod._id, prod)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)  
      )
  }

  public getAllProducts() {
      this.getProdutos()
        .subscribe((produtos) => {
          this.mProdutos = produtos;
          for (let i = 0; i < produtos.length; i++) {
            this.mProdutos[i].qtdFoto = [];
            for (let j = 0; j < produtos[i].caminhoFoto.length; j++) {
              this.mProdutos[i].qtdFoto.push(j);
            }
          }
          this.mProdutos.forEach(element => {
            this.mTdsProdutos.push(element);
          });
          this.mProdutos.forEach(element => {
            element.qtdInChart = {
              p: 0,
              m: 0,
              g: 0
            }
          })
          this.updateProducts();
        }
        );
  }
  
  public getAllTheseProds(prodsId: string[]): ProdutoMod[]{
    let allProds:ProdutoMod[];
    allProds = [];
    for (let index = 0; index < prodsId.length; index++) {
      for (let depper = 0; depper < this.mProdutos.length; depper++) {
        if (prodsId[index] == this.mProdutos[depper]._id){
          allProds.push(this.mProdutos[depper]);
        }
      }
    }
    return allProds;
  }

  getProdutos() {
    return this.http.get<ProdutoMod[]>(this.domain + '/prod/produtos')
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ProdutoMod[]>res)
      )
      
  }

  getProdutosWithFullResponse() {
    /*
    return this.http.get<ProdutoMod[]>(this.domain + '/prod/produtos', { observe: 'response' })
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      )
      .map(res => res);
         return null;
      */

  }

  public getProdutosPorIds(idCompra : string)  {
    return this.http.get<modalVisualizarCompra>(this.domain + '/prod/buscarLista/' + idCompra)
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => res)
      );
  }

  getProduto(id: string): ProdutoMod {
    let index = 0;
    console.log(Object.keys(this.mTdsProdutos));
    console.log(this.mProdutos);
    for (; index < this.mTdsProdutos.length; index++) {
      const element = this.mTdsProdutos[index];
      console.log(element._id +" == " + id);
      if (element._id == id){
        return element;
      }
    }
    return null;
  }

  getTamanhosProduto(prod: ProdutoMod): string[]{
    return Object.keys(prod.qtdEmTamanhos).splice(1, 3);
  }

  public buscarProdPorcategoria(cat: string, sex: string) {
    console.log(this.mTdsProdutos);
    this.mProdutos.splice(0, this.mProdutos.length);

    this.mTdsProdutos.forEach(element => {
      console.log(element.genero.toLowerCase() + "  -  " + sex.toLowerCase());
      if (element.genero.toLowerCase() == sex.toLowerCase()) {
        var flag: boolean = false;
        for (var index = 0; index < element.categoria.length; index++) {
          console.log(element.categoria[index].toLowerCase() + " - " + cat.toLowerCase());
          if (!flag && element.categoria[index].toLowerCase() == cat.toLowerCase()) {
            this.mProdutos.push(element);
            flag = true;
          }
        }
      }
    });
    this.updateProducts();
  }

  public buscarProdPorCodigo(codDeBarra: string) {
    this.mProdutos.splice(0, this.mProdutos.length);
    this.mTdsProdutos.forEach(element => {
      if (element._id == codDeBarra) {
        this.mProdutos.push(element);
      }
    });
  }

  public buscarProdPorMarca(marca: string) {
    this.mProdutos.splice(0, this.mProdutos.length);
    this.mTdsProdutos.forEach(element => {
      if (element.marca == marca) {
        this.mProdutos.push(element);
      }
    });
  }

  public buscarProdPorPreco(precoMax: number, precoMin: number) {
    this.mProdutos.splice(0, this.mProdutos.length);
    this.mTdsProdutos.forEach(element => {
      if (element.preco <= precoMax && element.preco >= precoMin) {
        this.mProdutos.push(element);
      }
    });
  }

  public buscarProdPorGenero(sex: string) {
    this.mProdutos.splice(0, this.mProdutos.length);
    this.mTdsProdutos.forEach(element => {
      if (element.genero == sex) {
        this.mProdutos.push(element);
      }
    });
  }

  public listarProdutosNoPerfilDoCliente(client: ClienteMod) {

  }

  public addNovoProduto(prod: ProdutoMod) {
    return this.http.post<ProdutoMod>(this.domain + '/prod/add_produto', prod)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ProdutoMod>res)
      )
  }

  public alterarDadosProduto(prod: ProdutoMod) {

  }

  addTask(newTask) {
    return this.http.post<ProdutoMod>(this.domain + '/prod/produtos', newTask)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ProdutoMod>res)
      )
  }

  deleteTask(id) {
    return this.http.delete(`$(this.domain)/prod/tasks/$(id)`)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ProdutoMod>res)
      )
  }

  updateTask(newTask) {
    return this.http.put(`$(this.domain)/prod/tasks/$(newTask.id)`, newTask)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <ProdutoMod>res)
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
    return null; // new ErrorObservable('Algo de errado não está certo. Por favor, tente novamente mais tarde.');
  };
  /*
  getProduto(id: string) {
    return this.http.get<ProdutoMod>(this.domain + '/api/produto/' + id).map(res => res);
  }

  payBuyings(chart: PedidoAoPagSeguro) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.domain + '/api/checkOut', JSON.stringify(chart), httpOptions)
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      )
      .map(res => res);
  }
*/
}
