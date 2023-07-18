import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css'],
})
export class DireccionesComponent implements OnInit {
  public direccion: any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false,
  };
  public token: any;
  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  public direcciones: Array<any> = [];

  public load_data = true

  constructor(
    private _guestServices: GuestService,
    private _clienteServices: ClienteService
  ) {
    this.token = localStorage.getItem('token');

    this._guestServices.get_Regiones().subscribe((response) => {
      this.regiones_arr = response;
    });

    this._guestServices.get_Provincias().subscribe((response) => {
      this.provincias_arr = response;
    });

    this._guestServices.get_Distritos().subscribe((response) => {
      this.distritos_arr = response;
    });
  }

  ngOnInit(): void {
    this.obtener_direccion();
  }

  obtener_direccion() {
    this._clienteServices
      .obtener_direccion_todos_cliente(localStorage.getItem('_id'), this.token)
      .subscribe((response) => {
        this.direcciones = response.data;
      });
      this.load_data = false;
  }

  select_pais() {
    if (this.direccion.pais == 'Perú') {
      $('#sl-region').prop('disabled', false);
      this._guestServices.get_Regiones().subscribe((response) => {
        response.forEach((element: any) => {
          this.regiones.push({
            id: element.id,
            name: element.name,
          });
        });
      });
    } else {
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      this.regiones = [];
      this.provincias = [];

      this.direccion.region = '';
      this.direccion.provincia = '';
    }
  }

  select_region() {
    this.provincias = [];
    $('#sl-provincia').prop('disabled', false);
    $('#sl-distrito').prop('disabled', true);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    this._guestServices.get_Provincias().subscribe((response) => {
      response.forEach((element: any) => {
        if (element.department_id == this.direccion.region) {
          this.provincias.push(element);
        }
      });
      console.log(this.provincias);
    });
  }

  select_provincia() {
    this.distritos = [];
    $('#sl-distrito').prop('disabled', false);
    this.direccion.distrito = '';
    this._guestServices.get_Distritos().subscribe((response) => {
      response.forEach((element: any) => {
        if (element.province_id == this.direccion.provincia) {
          this.distritos.push(element);
        }
      });
      console.log(this.distritos);
    });
  }

  registrar(registroForm: any) {
    if (registroForm.valid) {
      this.regiones_arr.forEach((element) => {
        if (parseInt(element.id) == parseInt(this.direccion.region)) {
          this.direccion.region = element.name;
        }
      });

      this.provincias_arr.forEach((element) => {
        if (parseInt(element.id) == parseInt(this.direccion.provincia)) {
          this.direccion.provincia = element.name;
        }
      });

      this.distritos_arr.forEach((element) => {
        if (parseInt(element.id) == parseInt(this.direccion.distrito)) {
          this.direccion.distrito = element.name;
        }
      });

      var data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('_id'),
      };

      this._clienteServices
        .registro_direccion_cliente(data, this.token)
        .subscribe((response) => {
          this.direccion = {
            pais: '',
            region: '',
            provincia: '',
            distrito: '',
            principal: false,
          };
          $('#sl-region').prop('disabled', true);
          $('#sl-provincia').prop('disabled', true);
          $('#sl-distrito').prop('disabled', true);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agrego la nueva direccion correctamente',
          });
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

  establecer_principal(id: any) {
    this._clienteServices
      .cambiar_direccion_principal_cliente(
        id,
        localStorage.getItem('_id'),
        this.token
      )
      .subscribe((response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizo la direccion principal',
        });
        this.obtener_direccion();
      });
  }
}
