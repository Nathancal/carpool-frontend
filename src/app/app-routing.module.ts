import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserdashboardComponent } from './pages/userdashboard/userdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },{
    path: 'userdashboard',
    component: UserdashboardComponent

  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
