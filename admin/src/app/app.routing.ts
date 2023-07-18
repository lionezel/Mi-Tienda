import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { IndexProductosComponent } from './components/productos/index-productos/index-productos.component';
import { UpdateProductosComponent } from './components/productos/update-productos/update-productos.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { CreateCuponComponent } from './components/cupones/create-cupon/create-cupon.component';
import { IndexCuponComponent } from './components/cupones/index-cupon/index-cupon.component';
import { UpdateCuponComponent } from './components/cupones/update-cupon/update-cupon.component';
import { ConfigComponent } from './components/config/config.component';
import { VariedadProductoComponent } from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent } from './components/productos/galeria-producto/galeria-producto.component';
import { IndexDescuentoComponent } from './components/descuento/index-descuento/index-descuento.component';
import { CreateDescuentoComponent } from './components/descuento/create-descuento/create-descuento.component';
import { EditDescuentoComponent } from './components/descuento/edit-descuento/edit-descuento.component';
import { IndexContactoComponent } from './components/contacto/index-contacto/index-contacto.component';
import { IndexVentasComponent } from './components/ventas/index-ventas/index-ventas.component';
import { DetalleVentasComponent } from './components/ventas/detalle-ventas/detalle-ventas.component';

const appRouter: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },

  {
    path: 'panel',
    children: [
      { path: 'clientes', component: IndexClienteComponent },
      { path: 'clientes/registro', component: CreateClienteComponent },
      { path: 'clientes/:id', component: EditClienteComponent },

      { path: 'productos/registro', component: CreateProductoComponent },
      { path: 'productos', component: IndexProductosComponent },
      { path: 'productos/:id', component: UpdateProductosComponent },
      {
        path: 'productos/inventario/:id',
        component: InventarioProductoComponent,
      },
      {
        path: 'productos/variedades/:id',
        component: VariedadProductoComponent,
      },
      { path: 'productos/galeria/:id', component: GaleriaProductoComponent },

      { path: 'cupones/registro', component: CreateCuponComponent },
      { path: 'cupones', component: IndexCuponComponent },
      { path: 'cupones/:id', component: UpdateCuponComponent },

      { path: 'descuentos', component: IndexDescuentoComponent },
      { path: 'descuentos/registro', component: CreateDescuentoComponent },
      { path: 'descuentos/:id', component: EditDescuentoComponent },

      { path: 'configuraciones', component: ConfigComponent },

      { path: 'ventas', component: IndexVentasComponent },
      { path: 'ventas/:id', component: DetalleVentasComponent },

      { path: 'contactos', component: IndexContactoComponent },
    ],
  },

  { path: 'login', component: LoginComponent },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> =
  RouterModule.forRoot(appRouter);
