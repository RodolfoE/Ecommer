import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProdutosService } from '../../service/http/produtos.service';
import { ProdutoMod } from './../../models/produto';
import { Observable } from 'rxjs/internal/Observable';
import { ClienteService } from './../../service/http/cliente.service';
import { CompraService } from './../../service/http/compra.service';
import { CarrinhoService } from './../../service/http/carrinho.service';


@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})

export class ProdutosComponent implements OnInit {
  mObservable: any;
  mProdutos: ProdutoMod[];

  constructor(private produtosService: ProdutosService,
    private clienteService: ClienteService,
    private carrinhoService: CarrinhoService,
    private compraService: CompraService) {

    if (produtosService.mProdutos != null) {
      this.mProdutos = produtosService.mProdutos;
    }

    this.produtosService.test.subscribe(prods => {
      this.mProdutos = prods;
    })
    if (clienteService.mCliente != null) {
      this.carrinhoService.getCarrinhoClinte(clienteService.mCliente);
      this.produtosService.listarProdutosNoPerfilDoCliente(clienteService.mCliente);
    }
  }

  addProdutoAoCarrinho(prod: ProdutoMod, tamanho: string) {
    if (this.clienteService.mCliente != null) {
      let prodReferencia = this.produtosService.getProduto(prod._id);
      if (this.qtdDisponivelEmEstoque(prodReferencia, tamanho)) {
        this.carrinhoService.addItemAoCarrinho(prodReferencia, this.clienteService.mCliente);
      } else {
        alert('Número de Produtos ultrapassou a quantidade em estoque!');
      }
    } else {
      console.log("Cliente não logado");
    }
  }

  qtdDisponivelEmEstoque(prod: ProdutoMod, tamanho: string) : boolean{
    console.log(prod.qtdEmTamanhos[tamanho] + " > 0");
    if (prod.qtdEmTamanhos[tamanho] > 0){
      prod.tamanhoEscolhido = tamanho;
      prod.qtdEmTamanhos[tamanho] = prod.qtdEmTamanhos[tamanho] - 1
      return true;
    } 
    return false;
  }

  ngOnInit() {

  }
}
