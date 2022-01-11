import { Component, Inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-pickupdetails',
  templateUrl: './pickupdetails.component.html',
  styleUrls: ['./pickupdetails.component.css']
})
export class PickupdetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public mapService: MapsService) { }

  locationAddress: any;

  ngOnInit(): void {
    this.reverseGeocode()
  }

  reverseGeocode(){
    this.mapService.getAddress(this.data.lat, this.data.lng).subscribe((res:any)=>{
      this.locationAddress = res.addresses[0].address.freeformAddress;
      console.log(this.locationAddress);
    })

  }

}
