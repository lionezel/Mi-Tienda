import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css'],
})
export class IndexVentasComponent implements OnInit {
  public token;
  public desde: any;
  public hasta: any;
  public ventas: Array<any> = [];

  constructor(private _adminServices: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._adminServices
      .obtener_ventas_admin(this.desde, this.hasta, this.token)
      .subscribe((response) => {
        this.ventas = response.data;
      });
  }

  filtrar() {
    this._adminServices
      .obtener_ventas_admin(this.desde, this.hasta, this.token)
      .subscribe((response) => {
        this.ventas = response.data;
      });
  }
}
