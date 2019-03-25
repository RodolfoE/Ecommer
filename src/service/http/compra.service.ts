import { catchError, retry } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompraMod } from './../../models/compra'
import { ProdutosService } from "./produtos.service";
import { ProdutoMod } from '../../models/produto';
import { EnvioService } from "./envio.service";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CompraService {
  domain: string = 'http://localhost:3000';
  mCompra: CompraMod;
  constructor(private produtoService: ProdutosService,
     private mEnvioService: EnvioService,
     private http: HttpClient ) { }

  public finalizarCompra(mCompra: CompraMod) {
    //subtrair produtos
    mCompra.mCarrinho.produtos.forEach(element => {
      let prod: ProdutoMod = new ProdutoMod();
      //prod = this.produtoService.getProduto(element);  
      this.produtoService.editProd(prod, 'subtrair-qtd').subscribe(param =>{
        this.produtoService.getAllProducts();
        this.produtoService.updateProducts();
        alert('Compra Finalizada Com Sucesso');
      });
    })
    
      //subir compra pro bd
      this.salvarCompraNoMongo(mCompra).subscribe(param =>{
        //gerar novo envio
        this.mEnvioService.gerarNovoEnvio(param._id+'');
        console.log(param);
      });
      //this.servicoCompartilhado.voltarParaPagInicial();
  }

  private salvarCompraNoMongo(comp: CompraMod) : Observable<CompraMod>{
    return this.http.post<CompraMod>(this.domain + '/comp/compra', comp)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <CompraMod>res)  
    )
  }

  public addCompraAoHistorico() {

  }

  public checkUsuarioCadastro(): boolean {
    return false;
  }

  public addCompraFiado() {
    this.mCompra.isVendaEmAberto = true;
  }

  public exibirTdsAsCompras() :Observable<CompraMod[]>{
    return this.http.get<CompraMod[]>(this.domain + '/comp/compras')
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <CompraMod[]>res)
      )
      
  }

  public editarInformacoesCompra(comandoMongo: any) : Observable<any>{
    return this.http.post<any>(this.domain + '/comp/editar_informacoes_compra', comandoMongo)
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
      ,map(res => <any>res)
      )
      
  }

  public exibirHistoricoDeCompraPorData(): CompraMod[] {
    return null;
  }

  public exibirHistoricoDeCompraPorClient(): CompraMod[] {
    return null;
  }

  public exibirHistoricoDeCompraPorIntervaloDeData(): CompraMod[] {
    return null;
  }

  public exibirVendaFiado(): CompraMod[] {
    return null;
  }

  public finalizarCompraFiado() {

  }

  public exibirVendaNaoRecebida() {

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
