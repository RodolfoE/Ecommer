import {CompraMod} from './compra';

export class EnvioMod{
    mCompra:CompraMod;
    mData: Date;
    _id?: string;
    idCompra: string;
    isPostadoAoCorreio:boolean;
    mResponsavelPelaPostagem:string;
    isEntrege:boolean;
    mResponsavelPelaEntrega: string; //quem disse que já foi entregue!

    constructor(){
        
    }
}