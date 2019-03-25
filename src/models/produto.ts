import {ComentarioMod} from './comentario';
export class ProdutoMod{
 //variáveis de banco
 _id? : string;
 nomeProduto: string;
 marca: string;
 categoria: any[]; //['feminino', 'calca']
 preco: number;
 freteGratuido: boolean;
 freteGratuito: boolean;
 tamanhos: string[];
 tamanhoEscolhido: string;
 descricao: string;
 caminhoFoto: string[]; //['assets/produtos/camisas/000001_lacoste_1.jpg', 'assets/produtos/camisas/000001_lacoste_2.jpg'];
 qtdFoto: number[];
 qtdInChart:{};
 qtdEmEstoque:number;
 qtdEmTamanhos: {};
 comentarios: ComentarioMod[];
 genero: string;

  constructor(){
    
  }
}