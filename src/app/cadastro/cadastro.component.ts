import { Component, OnInit, HostListener, ElementRef, ViewChild, } from '@angular/core';
import { ClienteMod } from './../../models/cliente';
import { ClienteService } from '../../service/http/cliente.service'
import { EnderecoMod } from './../../models/endereco';
import { Router, NavigationStart } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AppPasswordDirective } from '../../directive/app-password.directive'
import { FormControl } from '@angular/forms';
import * as moment from "moment";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})

export class CadastroComponent implements OnInit {
  @ViewChild('img')
  placeholder: ElementRef;
  selectedIndex = new FormControl(0);
  mCliente: ClienteMod;
  ConfirmacaoSenha: string;
  mSelectedFile: File = null;
  UsuarioIdMongo: string = null;
  linkToProfilePicture: string = "assets/photo.jpeg";
  hiddenLinkToProfilePicture: string = "";
  registroSalvo: boolean = false;



  constructor(private clienteService: ClienteService,
    private router: Router,
    private http: HttpClient) {
    this.mCliente = new ClienteMod();
  }

  /*
  Evento não estava funcionando quando não estava retornando nada. No stackoverflow, foi digo
  que era necessário retornar algum boleano.
  obs: evento funcionava antes, mas somente quando estava com breakpoint na função.
  */
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.removeImgCaseItsLoaded();
    this.UsuarioIdMongo = '';
    this.linkToProfilePicture = '';
    this.registroSalvo = false;
    return true;
  }

  removeImgCaseItsLoaded() {
    if (!this.registroSalvo) {
      if (this.UsuarioIdMongo != null && this.UsuarioIdMongo != '') {
        this.clienteService.apagarRegistroCliente(this.UsuarioIdMongo).subscribe(event => {
          this.mSelectedFile = null;
          this.UsuarioIdMongo = '';
          this.linkToProfilePicture = "assets/photo.jpeg";
          this.hiddenLinkToProfilePicture = '';
          this.registroSalvo = true;
        });
      }
    }
  }

  private routeSub: any;  // subscription to route observer


  onFileSelected(event) {
    this.mSelectedFile = (<File>event.target.files[0]);

    var reader = new FileReader();

    reader.readAsDataURL(<File>event.target.files[0]); // read file as data url

    reader.onload = (event => { // called once readAsDataURL is completed
      this.uploadImg(event.target['result']);
    }
    )
  }

  uploadImg(imagem) {
    const fd = new FormData();
    this.clienteService.uploadFotoPerfil(this.UsuarioIdMongo, fd, this.mSelectedFile).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress' + Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        this.UsuarioIdMongo = event.body.idNumero;
        this.linkToProfilePicture = imagem;
        this.placeholder.nativeElement.setAttribute('class', 'imgInvisivel')
      }
    });
  }

  validacaoDeCamposSemInconcistencia(): boolean {
    if (this.mCliente.mSenha.length < 6) {
      alert('Campo senha deve conter mais que 6 caracteres.')
      return false;
    }
    if (this.mCliente.mSenha !== this.ConfirmacaoSenha) {
      alert('O campo confirmação de senha está diferente do campo senha.')
      return false;
    }

    if (!(this.mCliente.mNome != '' && this.mCliente.mUsuario != '' &&
      this.mCliente.mSenha != '' && this.mCliente.mEmail != '' &&
      this.mCliente.mGenero != '' && this.mCliente.mIdade != '')) {
      alert('Todos os campos de informação pessoal deve ser preenchido.')
      return false;
    }
    return true;
  }

  Cancelar() {
    this.router.navigateByUrl('/produtos');
    this.removeImgCaseItsLoaded();
  }

  selectTab(index: number): void {
    this.selectedIndex.setValue(index);
  }

  ngOnInit() {
    this.obterEndereco();
  }

  obterEndereco() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.clienteService.buscarEnderecoCliente({
            lat: position.coords.latitude
            , log: position.coords.longitude
          }).subscribe(res => {
            this.mCliente.mEndereco.postalCode = res[0].zipcode;
            this.mCliente.mEndereco.street = res[0].streetName;
            this.mCliente.mEndereco.number = res[0].streetNumber;
            this.mCliente.mEndereco.district = res[0].extra.neighborhood;
            this.mCliente.mEndereco.city = res[0].administrativeLevels.level2long;
            this.mCliente.mEndereco.state = res[0].administrativeLevels.level1long;
          })
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    };
  }


  salvarCadastro() {
    if (true /*this.validacaoDeCamposSemInconcistencia()*/) {
      this.clienteService.checarExistenciaDeUsuario(this.mCliente.mUsuario).subscribe(res => {
        if (res['existeUsuario']) {
          alert(res['mensagemErro']);
        } else {
          this.clienteService.checarExistenciaDeEmail(this.mCliente.mEmail).subscribe(resposta => {
            if (resposta['existeUsuario']) {
              alert(resposta['mensagemErro']);
            } else {
              this.mCliente.atualizar = false;
              this.clienteService.addCliente(this.UsuarioIdMongo, this.mCliente).subscribe((param: Object) => {
                if (param['cliente']['ok'] === 1) {
                  this.registroSalvo = true;
                  if (param['cliente'] && param['idToken']) {
                    this.router.navigateByUrl('/produtos');
                    this.clienteService.initCliente(param);
                  }
                }
              })
            }
          })
        }
      });
    }
  }
}
