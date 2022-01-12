import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';
import { PickupService } from 'src/app/services/pickup.service';

@Component({
  selector: 'app-pickupdetails',
  templateUrl: './pickupdetails.component.html',
  styleUrls: ['./pickupdetails.component.css']
})
export class PickupdetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public mapService: MapsService, public pickupService: PickupService) { }

  locationAddress: any;
  loading = false;



  ngOnInit(): void {
    this.reverseGeocode()
  }

  pickupForm = new FormGroup({
    direction: new FormControl('', [
      Validators.required
    ]),
    numPassengers: new FormControl('', [
      Validators.required
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    time: new FormControl('', [
      Validators.required
    ])
  })

  reverseGeocode(){
    this.mapService.getAddress(this.data.lat, this.data.lng).subscribe((res:any)=>{
      this.locationAddress = res.addresses[0].address.freeformAddress;
      console.log(this.locationAddress);
    })
  }

  pickupFormSubmit(){
    this.loading = true;


    console.log(this.pickupForm.value.date)

    let pickupData  = {
        'hostId': 'hostidstringtest',
        'lat': this.data.lat,
        'lng': this.data.lng,
        'date': this.pickupForm.value.date,
        'time': this.pickupForm.value.time,
        'address': this.locationAddress
    }

    this.pickupService.createPickup(pickupData).subscribe((res)=>{
      console.log(res);
      this.loading = false;
    })

  }

}
