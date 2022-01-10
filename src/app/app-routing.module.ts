import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InteractivemapComponent } from './components/interactivemap/interactivemap.component';
import { HomeComponent } from './pages/home/home.component';
import { UserdashboardComponent } from './pages/userdashboard/userdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },{
    path: 'userdashboard',
    component: InteractivemapComponent

  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
