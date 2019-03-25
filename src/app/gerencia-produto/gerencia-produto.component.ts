import { Component, OnInit } from '@angular/core';
import { ProdutoMod } from './../../models/produto'
import { ProdutosService } from './../../service/http/produtos.service';
import { Router } from '@angular/router';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-gerencia-produto',
  templateUrl: './gerencia-produto.component.html',
  styleUrls: ['./gerencia-produto.component.css']
})
export class GerenciaProdutoComponent implements OnInit {
  mProd: ProdutoMod;
  mCategoria: string;

  constructor(private produtosService: ProdutosService,  private router: Router) {
    this.mCategoria = '';
    this.mProd = new ProdutoMod();
    this.mProd.qtdFoto = [];
    this.mProd.qtdEmTamanhos = {
      tamanhos: ['p', 'm', 'g'],
      p: 0,
      m: 0,
      g: 0
    }
    this.mProd.categoria = [];
    this.mProd.caminhoFoto = [];
  }

  bo: boolean = true;
  qtdFoto : number = 0;
  addFoto() {
    if (this.bo) {
      this.mProd.caminhoFoto.push('assets/produtos/camisas/000001_lacoste_2.jpg');
      this.mProd.qtdFoto.push(this.qtdFoto++);
    } else {
      this.mProd.caminhoFoto.push('assets/produtos/camisas/000001_lacoste_1.jpg');
      this.mProd.qtdFoto.push(this.qtdFoto++);
    }
    this.bo = !this.bo;
  }

  addProduto() {
    this.mProd.categoria.push(this.mCategoria);
    this.mProd.comentarios = [];
    this.produtosService.addNovoProduto(this.mProd).subscribe(returno => {
      this.produtosService.mProdutos.push(returno);
      alert('Produto Add Com Sucesso!');
      this.router.navigateByUrl('/produtos');
    });
  }

  ngOnInit() {
  }

}
