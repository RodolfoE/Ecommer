import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../service/http/produtos.service';
import { ClienteService } from '../../service/http/cliente.service';
import { ProdutoMod } from '../../models/produto';
import { ClienteMod } from '../../models/cliente';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ComentarioMod } from '../../models/comentario';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  mProduto: ProdutoMod;
  mClientesComentarios: ClienteMod[];
  mTxtComment: string;
  private sl: any;
  private id: string;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private Prodservice: ProdutosService,
    private clienteService: ClienteService) {

  }

  ngOnInit() {
    this.sl = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.mProduto = this.Prodservice.getProduto(this.id);
      this.mProduto.tamanhos = this.Prodservice.getTamanhosProduto(this.mProduto);
      this.getAllClientsOnTheComments();
      this.formatAllCommentsDate();
    });
  }

  private getAllClientsOnTheComments() {
    this.mClientesComentarios = [];
    for (let i = 0; i < this.mProduto.comentarios.length; i++) {
      this.mProduto.comentarios[i].mCliente = this.clienteService.getClienteById(this.mProduto.comentarios[0].cliente);
    }
  }

  private formatAllCommentsDate(){
    for (let i = 0; i < this.mProduto.comentarios.length; i++) {
      const element = this.mProduto.comentarios[i];
      this.mProduto.comentarios[i].data = this.formatData(element.data) + ' dia(s)'; 
    }
  }


  private enviarComentario() {
    if (this.clienteService.mCliente != null) {
      let comentario = new ComentarioMod();
      comentario.txt = this.mTxtComment;
      comentario.cliente = this.clienteService.mCliente._id;
      comentario.data = new Date();
      comentario.mProdutoId = this.mProduto._id;
      this.mProduto.comentarios.push(comentario);
      this.Prodservice.editProd(this.mProduto, 'comentar-prod').subscribe(param => {
        comentario.data = this.formatData(comentario.data) + ' dia(s)';
        console.log(param);
      })
    } else {
      alert('Não é possível comentar sem estar logado!');
    }
  }

  formatData(dat: Date): string {
    var date1 = new Date();
    console.log(date1);
    console.log(" - ")
    var date2 = new Date(dat);
    console.log(date2);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log('diferença: ' + diffDays);
    return diffDays.toString();
  }
}
