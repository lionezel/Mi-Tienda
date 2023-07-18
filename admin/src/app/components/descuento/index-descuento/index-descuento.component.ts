import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { DescuentosService } from 'src/app/services/descuentos.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css'],
})
export class IndexDescuentoComponent implements OnInit {
  public load_data: any = true;
  public filtro = '';
  public token: any;
  public descuentos: Array<any> = [];
  public url;
  public load_btn = false;

  constructor(private _descuentoServices: DescuentosService) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._descuentoServices
      .listar_descuento_admin(this.filtro, this.token)
      .subscribe((response) => {
        console.log(response);
        this.descuentos = response.data;

        this.descuentos.forEach((element) => {
          var tt_inicio = Date.parse(element.fecha_inicio + 'T00:00:00') / 1000;
          var tt_fin = Date.parse(element.fecha_fin + 'T00:00:00') / 1000;

          var today = Date.parse(new Date().toString()) / 1000;

          if (today > tt_inicio) {
            element.estado = 'Expirado';
          }
          if (today < tt_inicio) {
            element.estado = 'Proximamente';
          }
          if (today >= tt_inicio && today <= tt_fin) {
            element.estado = 'En progreso';
          }
        });

        this.load_data = false;
      });
  }

  filtrar() {
    if (this.filtro) {
      this._descuentoServices
        .listar_descuento_admin(this.filtro, this.token)
        .subscribe((response) => {
          console.log(response);
          this.descuentos = response.data;
          this.load_data = false;
        });
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar',
      });
    }
  }

  resetear() {
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._descuentoServices
      .eliminar_descuento_admin(id, this.token)
      .subscribe((response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino correctamente el producto',
        });

        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn = false;

        this.init_data();
      });
  }
}
