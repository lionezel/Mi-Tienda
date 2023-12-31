import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css'],
})
export class IndexClienteComponent implements OnInit {
  public clientes: Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';
  public token;
  public load_data = true;
  

  constructor(
    private _clienteService: ClienteService,
    private _adminServices: AdminService
  ) {
    this.token = this._adminServices.getToken();
    console.log(this.token);
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data() {
    this._clienteService
      .listar_clientes_filtro_admin(null, null, this.token)
      .subscribe((Response) => {
        this.clientes = Response.data;
        this.load_data = false;
      });
  }

  filtro(tipo: any) {
    if (tipo == 'apellidos') {
      if (this.filtro_apellidos) {
        this.load_data = true;
        this._clienteService
          .listar_clientes_filtro_admin(tipo, this.filtro_apellidos, this.token)
          .subscribe((Response) => {
            this.clientes = Response.data;
            this.load_data = false;
          });
      } else {
        this.init_Data();
      }
    } else if (tipo == 'correo') {
      if (this.filtro_correo) {
        this.load_data = true;
        this._clienteService
          .listar_clientes_filtro_admin(tipo, this.filtro_correo, this.token)
          .subscribe((Response) => {
            this.clientes = Response.data;
            this.load_data = false;
          });
      } else {
        this.init_Data();
      }
    }
  }

  eliminar(id: any) {
    this._clienteService
      .eleminar_cliente_admin(id, this.token)
      .subscribe((response) => {
        console.log(response);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino correctamente el cliente',
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.init_Data();
      });
  }
}
