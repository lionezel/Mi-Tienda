import { Component } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  public contacto: any = {};
  public load_btn = false;

  constructor(private _guestServices: GuestService) {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._guestServices
        .enviar_mensaje_contacto(this.contacto)
        .subscribe((response) => {
          console.log(response);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se envio correctamente el mensaje',
          });
          this.contacto = {};
          this.load_btn = false;
        });
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
      });
    }
  }
}
