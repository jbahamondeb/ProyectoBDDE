import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PruebaComponent} from '../app/prueba/prueba.component';
import {MapComponent} from '../app/map/map.component';
import {NavbarComponent} from '../app/navbar/navbar.component'

const routes: Routes = [
  { path: 'prueba', component: PruebaComponent },
  { path: '', component: MapComponent },
  {path:'navbar',component:NavbarComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
