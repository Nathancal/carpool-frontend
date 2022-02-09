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
import { ReactiveFormsModule } from '@angular/forms';
import { JourneydetailComponent } from './components/journeydetail/journeydetail.component';
import { JourneyoverviewComponent } from './components/journeyoverview/journeyoverview.component';
import { JourneyjoinComponent } from './components/journeyjoin/journeyjoin.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrscannerComponent } from './components/qrscanner/qrscanner.component';
import { QrgeneratorComponent } from './components/qrgenerator/qrgenerator.component';



@NgModule({
  declarations: [
    AppComponent,
    InteractivemapComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    UserdashboardComponent,
    PickupdetailsComponent,
    SearchbarComponent,
    JourneydetailComponent,
    JourneyoverviewComponent,
    JourneyjoinComponent,
    QrscannerComponent,
    QrgeneratorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    QRCodeModule,
    ZXingScannerModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
