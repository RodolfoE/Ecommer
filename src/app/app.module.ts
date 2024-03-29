import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule  } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteService } from '../service/http/cliente.service';
import { LoginComponent } from './login/login.component'
import { HttpClientModule } from '@angular/common/http'; 
import { ProdutoComponent } from './produto/produto.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { GerenciaProdutoComponent } from './gerencia-produto/gerencia-produto.component';
import { CadastroComponent } from './cadastro/cadastro.component';

@NgModule({
  declarations: [ AppComponent, ProdutoComponent, ProdutosComponent, GerenciaProdutoComponent, CadastroComponent, LoginComponent ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ClienteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
