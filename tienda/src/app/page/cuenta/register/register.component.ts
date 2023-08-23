import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public register_user: any = {};
  public new_user: any = {};

  constructor(private _clienteServices: ClienteService) {}

  register(registerForm: any) {
    if (registerForm.valid) {
      let data = {
        nombres: this.register_user.nombres,
        apellido: this.register_user.apellido,
        email: this.register_user.email,
        password: this.register_user.password,
      };

      this._clienteServices.register_cliente(data).subscribe((response) => {
        if (response.data === undefined) {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#ff0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: response.message,
          });
        } else {
        }

        console.log(response);
      });
    }
  }
}
