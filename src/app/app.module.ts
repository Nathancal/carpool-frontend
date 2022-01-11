import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InteractivemapComponent } from './components/interactivemap/interactivemap.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './pages/home/home.component';
import { UserdashboardComponent } from './pages/userdashboard/userdashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PickupdetailsComponent } from './components/pickupdetails/pickupdetails.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';


@NgModule({
  declarations: [
    AppComponent,
    InteractivemapComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    UserdashboardComponent,
    PickupdetailsComponent,
    SearchbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
