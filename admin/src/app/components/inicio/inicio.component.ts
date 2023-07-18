import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public token;

  constructor(private _adminServices: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminServices
      .kpi_ganancias_mensuales_admin(this.token)
      .subscribe((response) => {});
  }
}
