import { ClienteMod } from '../models/cliente'
import { ProdutoMod } from './produto';
import { CarrinhoMod } from './carrinho';

export class modalVisualizarCompra {
  _id: number;
  nomeProduto: string;
  codigoProduto: string;
  preco: number;
  qtd: number;
  ObjetosDoProduto: ProdutoMod[];
  ObjetoDoCliente: ClienteMod[];
  ObjetoStatusRecebimento: any;
  ObjetoOrigemCompra: any;
  observacao: string;
  carrinho: CarrinhoMod;
  constructor() {

  }
}