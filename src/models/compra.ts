import {ClienteMod} from './cliente';
import {CarrinhoMod} from './carrinho';

export class CompraMod{
    _id?:number;
    carrinho: CarrinhoMod;
    client: string;
    mRecebido: boolean;
    dataCompra: string;
    IdOrigemCompra: string;
    IdStatusRecebimento: string;
    valorCompra: number;
    statusRecebimento: Object;
    origemCompra: Object;

    /*
    Deprecated
    */
   mCarrinho: CarrinhoMod;
   mData: Date;
   mClient: ClienteMod;
   isVendaEmAberto: boolean;
    constructor(){
        this.carrinho = new CarrinhoMod();
        this.carrinho.produtos = [];
    }
}