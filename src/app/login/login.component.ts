import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../service/http/cliente.service';
import { ClienteMod } from './../../models/cliente'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /*
  Default user: 
  */

  mCliente: ClienteMod;
  mClienteService: ClienteService;
  constructor(clienteService: ClienteService, private router: Router) { 
    this.mClienteService = clienteService;
    this.mCliente = new ClienteMod();
  }

  ngOnInit() {
  }

  fzrLogin(){
    this.mClienteService.fzrLogin(this.mCliente).subscribe(param => {
      if (param){
        //this.mClienteService.initCliente(param);
        this.router.navigateByUrl('/');
      } else {
        alert('Senha Inválida!');
      }
    })
  }
}
