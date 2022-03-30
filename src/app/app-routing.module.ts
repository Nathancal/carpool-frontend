import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InteractivemapComponent } from './components/interactivemap/interactivemap.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },{
    path: 'userdashboard',
    component: InteractivemapComponent

  },{
    path: 'userprofile',
    component: UserprofileComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
