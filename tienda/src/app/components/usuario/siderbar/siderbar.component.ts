import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css'],
})
export class SiderbarComponent {
  public token;
  public id: any;
  public user: any = undefined;
  public user_lc: any = undefined;

  constructor(private _clienteServices: ClienteService) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');

    if (this.token) {
      this._clienteServices
        .obtener_cliente_guest(this.id, this.token)
        .subscribe((response) => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
          } else {
            this.user_lc = undefined;
          }
        });
    }
  }
}
