import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css'],
})
export class CreateCuponComponent {
  public token: any;
  public cupon: any = {
    tipo: '',
  };
  public load_btn = false;

  constructor(private _cuponServices: CuponService, private _router: Router) {
    this.token = localStorage.getItem('token');
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._cuponServices
        .registro_cupon_admin(this.cupon, this.token)
        .subscribe((response) => {
          console.log(response);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registro correctamente el nuevo cupon',
          });
          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
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
