import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAppPassword]'
})
export class AppPasswordDirective {
  private _shown = false;

  constructor(private el: ElementRef) {
    this.setup();
   }
   
   setup() {
    const parent = this.el.nativeElement.parentNode;
    this.el.nativeElement.style.marginRight = '4px';
    const texto = document.createElement('span');
    texto.innerHTML = ' Exibir senha';
    const span = document.createElement('input');
    span.setAttribute('type', 'checkbox');
    span.setAttribute('class', 'space-txt-ch');
    span.setAttribute('tabindex', '-1');
    
    span.innerHTML = `Show password`;
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
    parent.setAttribute('class', 'semQuebraDeLinha');
    parent.appendChild(texto);
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      this.el.nativeElement.parentElement.nextElementSibling.lastElementChild.setAttribute('type', 'text');
      span.innerHTML = 'Hide password';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      this.el.nativeElement.parentElement.nextElementSibling.lastElementChild.setAttribute('type', 'password');
      span.innerHTML = 'Show password';
    }
  }
}
