import {ProdutoMod} from './produto';

export class CarrinhoMod{
    valorTotal:number;
    produtos: ProdutosNoCarrinho[];
    observacao: string;
    constructor(){
        this.produtos = [];    
    }
}

class ProdutosNoCarrinho{
    qtd: number; //qtd de produtos no carrinho
    _id: number; //id do produto
}