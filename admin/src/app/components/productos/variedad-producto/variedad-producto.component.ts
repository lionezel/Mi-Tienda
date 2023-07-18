import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css'],
})
export class VariedadProductoComponent {
  public producto: any = {};
  public id: any;
  public token;
  public nueva_variedad = '';
  public load_btn = false;
  public url: any;

  constructor(
    private _route: ActivatedRoute,
    private _productoServices: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this._productoServices
        .obtener_producto_admin(this.id, this.token)
        .subscribe((response) => {
          if (response.data == undefined) {
            this.producto = undefined;
          } else {
            this.producto = response.data;
          }
          console.log(this.producto);
        });
    });
  }

  agregar_variedad() {
    if (this.nueva_variedad) {
      this.producto.variedades.push({ titulo: this.nueva_variedad });
      this.nueva_variedad = '';
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'El campo de la variedad debe ser completada',
      });
    }
  }

  eliminar_variedad(idx: any) {
    this.producto.variedades.splice(idx, 1);
  }

  actualizar() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >= 1) {
        this.load_btn = true;
        this._productoServices
          .actualizar_variedades_admin(
            {
              titulo_variedad: this.producto.titulo_variedad,
              variedades: this.producto.variedades,
            },
            this.id,
            this.token
          )
          .subscribe((response) => {
            console.log(response);
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizo correctamente las variedades',
            });
            this.load_btn = false;
          });
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#ff0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Se debe agregar al menos una variedad',
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe completar el titulo de la variedad',
      });
    }
  }
}
