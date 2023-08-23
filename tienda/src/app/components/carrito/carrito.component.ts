import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from 'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';

declare var iziToast: any;
declare var Cleave: any;
declare var StickySidebar: any;
declare var paypal: any;


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton', { static: true })
  paypalElement!: ElementRef;
  public idcliente: any;
  public token: any;
  public carrito_arr: Array<any> = [];
  public url: any;
  public subtotal = 0;
  public total_pagar: any = 0;
  public socket = io('http://localhost:4201');
  public direccion_principal: any = {};
  public envios: Array<any> = [];

  public precio_envio = '0';
  public venta: any = {};
  public dventa: Array<any> = [];
  public descuento_activo: any = undefined;
  public  paymentHandler: any = null;
  

  constructor(
    private _clienteServices: ClienteService,
    private _guestServices: GuestService,
    private _router: Router
  ) {
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._guestServices.get_envios().subscribe((response) => {
      this.envios = response;
    });
  }

  ngOnInit(): void {
    this._guestServices.obtener_descuento_activo().subscribe((response) => {
      if (response.data != undefined) {
        this.descuento_activo = response.data[0];
      } else {
        this.descuento_activo = undefined;
      }
    });

    this.init_Data();
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type: any) {
          // update UI ...
        },
      });

      new Cleave('#cc-exp-date', {
        date: true,
        delimiter: '-',
        datePattern: ['Y', 'm', 'd'],
      });

      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    });

    this.get_direccion_principal();

    paypal
      .Buttons({
        style: {
          layout: 'horizontal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Pago en Mi Tienda',
                amount: {
                  currency_code: 'USD',
                  value: this.subtotal,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          console.log(order);
          this.venta.transaccion =
            order.purchase_units[0].payments.capture[0].id;

          this.venta.detalles = this.dventa;

          this._clienteServices
            .registro_compra_cliente(this.venta, this.token)
            .subscribe((response) => {
               console.log(response)
              this._router.navigate(['/']);
            });
        },
        onError: (err: any) => {},
        onCancel: function (data: any, actions: any) {},
      })
      .render(this.paypalElement.nativeElement);
  }

  init_Data() {
    this._clienteServices
      .obtener_carrito_cliente(this.idcliente._id, this.token)
      .subscribe((response) => {
        this.carrito_arr = response.data;
        this.carrito_arr.forEach((element) => {
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id'),
          });
        });
        this.calcular_carrit();
        this.calcular_total('Envio gratis');
      });
  }

  get_direccion_principal() {
    this._clienteServices
      .obtener_direccion_principal_cliente(
        localStorage.getItem('_id'),
        this.token
      )
      .subscribe((response) => {
        if (response.data == undefined) {
          this.direccion_principal = undefined;
        } else {
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }
      });
  }

  calcular_carrit() {
    this.subtotal = 0;
    if (this.descuento_activo == undefined) {
      this.carrito_arr.forEach((element) => {
        this.subtotal = this.subtotal + parseInt(element.producto.precio);
      });
    } else if (this.descuento_activo != undefined) {
      this.carrito_arr.forEach((element) => {
        let new_precio = Math.round(
          parseInt(element.producto.precio) -
            (parseInt(element.producto.precio) *
              this.descuento_activo.descuento) /
              100
        );
        this.subtotal = this.subtotal + new_precio;
      });
    }
  }

  eliminar_item(id: any) {
    this._clienteServices
      .eliminar_carrito_cliente(id, this.token)
      .subscribe((response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino el producto correctamente',
        });
        this.socket.emit('delete-carrito', { data: response.data });
        this.init_Data();
      });
  }

  calcular_total(envio_titulo: any) {
    this.total_pagar =
      parseInt(this.subtotal.toString()) +
      parseInt(this.precio_envio.toString());
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;

    console.log(this.venta);
  }

  completar_orden() {

  }

}
