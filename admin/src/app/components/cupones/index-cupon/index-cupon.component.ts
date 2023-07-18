import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css'],
})
export class IndexCuponComponent implements OnInit {
  public cupones: Array<any> = [];
  public load_data = true;
  public filtro = '';
  public token: any;

  constructor(private _cuponServices: CuponService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponServices
      .listar_cupones_admin(this.filtro, this.token)
      .subscribe((response) => {
        this.cupones = response.data;
        this.load_data = false;
      });
  }

  filtrar() {
    this._cuponServices
      .listar_cupones_admin(this.filtro, this.token)
      .subscribe((response) => {
        this.cupones = response.data;
        this.load_data = false;
      });
  }

  eliminar(id: any) {
    this._cuponServices
      .eleminar_cupon_admin(id, this.token)
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
        this._cuponServices
          .listar_cupones_admin(this.filtro, this.token)
          .subscribe((response) => {
            this.cupones = response.data;
            this.load_data = false;
          });
      });
  }
}
