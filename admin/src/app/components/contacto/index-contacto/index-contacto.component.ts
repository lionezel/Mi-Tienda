import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css'],
})
export class IndexContactoComponent implements OnInit {
  public mensajes: Array<any> = [];
  public load_data = true;
  public filtro = '';
  public token: any;

  public load_btn = false;

  constructor(private _adminServices: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminServices
      .obtener_mensajes_admin(this.token)
      .subscribe((response) => {
        this.mensajes = response.data;
        this.load_data = false;
      });
  }

  cerrar(id: any) {
    this.load_btn = true;
    this._adminServices
      .cerrar_mensajes_admin(id, { data: undefined }, this.token)
      .subscribe((response) => {
        console.log(response);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se cerro correctamente el mensaje',
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.init_data();
        this.load_btn = false;
      });
  }
}
