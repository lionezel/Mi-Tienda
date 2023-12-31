import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './page/cuenta/login/login.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { RegisterComponent } from './page/cuenta/register/register.component';

const appRouter: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'cuenta/perfil', component: PerfilComponent },
  { path: 'cuenta/direcciones', component: DireccionesComponent },
  { path: 'cuenta/ordenes', component: IndexOrdenesComponent },
  { path: 'cuenta/ordenes/:id', component: DetalleOrdenComponent },

  { path: 'carrito', component: CarritoComponent },

  { path: 'productos', component: IndexProductoComponent },
  { path: 'productos/categoria/:categoria', component: IndexProductoComponent },
  { path: 'productos/:slug', component: ShowProductoComponent },

  { path: 'contacto', component: ContactoComponent },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> =
  RouterModule.forRoot(appRouter);
