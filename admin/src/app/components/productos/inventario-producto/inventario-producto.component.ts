import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css'],
})
export class InventarioProductoComponent implements OnInit {
  public id: any;
  public token: any;
  public producto: any = {};
  public inventarios: Array<any> = [];
  public load_btn = false;
  public inventario: any = {};
  public _iduser: any;
  public arr_inventario: Array<any> = [];
  constructor(
    private _route: ActivatedRoute,
    private _productoServices: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this._productoServices
        .obtener_producto_admin(this.id, this.token)
        .subscribe((response) => {
          if (response.data == undefined) {
            this.producto = undefined;
          } else {
            this.producto = response.data;

            this._productoServices
              .listar_inventario_producto_admin(this.producto._id, this.token)
              .subscribe((response) => {
                this.inventarios = response.data;
                this.inventarios.forEach(element => {
                  this.arr_inventario.push({
                    admin: element.admin.nombres + " " + element.admin.apellido,
                    cantidad: element.cantidad,
                    proveedor: element.proveedor
                  })
                })
              });
          }
        });
    });
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._productoServices
      .eliminar_inventario_producto_admin(id, this.token)
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

        this._productoServices
          .listar_inventario_producto_admin(this.producto._id, this.token)
          .subscribe((response) => {
            this.inventarios = response.data;
            console.log(this.inventarios);
          });
      });
  }

  registro_inventario(invetarioForm: any) {
    if (invetarioForm.valid) {
      let data = {
        producto: this.producto._id,
        cantidad: invetarioForm.value.cantidad,
        admin: this._iduser,
        proveedor: invetarioForm.value.proveedor,
      };

      console.log(data);

      this._productoServices
        .registro_inventario_producto_admin(data, this.token)
        .subscribe((response) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agrego el nuevo stock al producto',
          });

          this._productoServices
            .listar_inventario_producto_admin(this.producto._id, this.token)
            .subscribe((response) => {
              this.inventarios = response.data;
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

  donwload_excel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30 },
      { header: 'Cantidad', key: 'col2', width: 15 },
      { header: 'Proveedor', key: 'col3', width: 25 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
