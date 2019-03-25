import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProdutoComponent } from './produto/produto.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { GerenciaProdutoComponent } from './gerencia-produto/gerencia-produto.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'produto/:id', component: ProdutoComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'cadastro', component: CadastroComponent},
  { path: 'gerencia_produto', component: GerenciaProdutoComponent},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/produtos', pathMatch: 'full'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
