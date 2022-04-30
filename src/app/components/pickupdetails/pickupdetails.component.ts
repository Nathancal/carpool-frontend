import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Map } from '@tomtom-international/web-sdk-maps';
import { MapsService } from 'src/app/services/maps.service';
import { PickupService } from 'src/app/services/pickup.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-pickupdetails',
  templateUrl: './pickupdetails.component.html',
  styleUrls: ['./pickupdetails.component.css'],
})
export class PickupdetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mapService: MapsService,
    public pickupService: PickupService,
    public notifierService: NotifierService,
    private dialogRef: MatDialogRef<PickupdetailsComponent>
  ) {
    dialogRef.disableClose = true;
  }

  embarkAddress: any;
  embarkLat: any;
  embarkLng: any;
  returnLat: any;
  returnLng: any;
  returnAddress: any;
  selectDestination!: boolean;
  map!: Map;

  loading = false;

  ngOnInit(): void {
    this.reverseGeocode();
    this.selectDestination = this.data.selectDestination;
    //If the data returned already contains an embark address it is added to the dialog and
    if(this.data.embarkAddress != undefined){
      this.embarkAddress = this.data.embarkAddress;
      this.embarkLat = this.data.embarkLat;
      this.embarkLng = this.data.embarkLng;
    }
  }

  pickupForm = new FormGroup({
    direction: new FormControl('', [Validators.required]),
    numPassengers: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
  });

  closeDialog(){
    this.selectDestination = false;
    this.embarkAddress = undefined;
    this.returnAddress = undefined;
    this.dialogRef.close({
      embarkAddress: this.embarkAddress,
      returnAddress: undefined,
      createCancelled: true,
      selectDestination: false

    })
  }

  reverseGeocode() {
    this.mapService
      .getAddress(this.data.lat, this.data.lng)
      .subscribe((res: any) => {
        //Checks to determine which time the dialog box has been opened, the first pickup or second.
        if (this.embarkAddress === undefined || false) {
          this.embarkAddress = res.addresses[0].address.freeformAddress;
          console.log('Embark lat ' + this.data.lat);
          this.embarkLat = this.data.lat
          this.embarkLng = this.data.lng
          console.log('Embark address added' + this.embarkAddress);
        } else {
          this.returnAddress = res.addresses[0].address.freeformAddress;
          this.returnLat = this.data.lat
          this.returnLng = this.data.lng
          console.log('Return address added' + this.returnAddress);
        }
      });
  }

  selectDestinationFunc() {
    this.dialogRef.close({
      createSuccessful: false,
      selectDestination: true,
      embarkAddress: this.embarkAddress,
      embarkLat: this.embarkLat,
      embarkLng: this.embarkLng
    });
  }

  pickupFormSubmit() {
    this.loading = true;

    console.log(this.pickupForm.value.date);

    console.log(this.embarkLat + ' ' + this.embarkLng);
    console.log(this.returnLat + ' ' + this.returnLng);

    let pickupData = {
      hostId: sessionStorage['userID'],
      eLat: this.embarkLat,
      eLng: this.embarkLng,
      rLat: this.returnLat,
      rLng: this.returnLng,
      date: this.pickupForm.value.date,
      embarkAddress: this.embarkAddress,
      returnAddress: this.returnAddress,
      time: this.pickupForm.value.time,
      totalNumPassengers: this.pickupForm.value.numPassengers,
    };

    this.pickupService.createPickup(pickupData).subscribe(
      (res) => {
        this.notifierService.showNotification("Pickup successfully created!", "Great!", 4000);
        this.loading = false;
        this.embarkAddress = undefined;
        this.returnAddress = undefined;
        this.embarkLat = undefined;
        this.embarkLng = undefined;
        this.dialogRef.close({ createSuccessful: true, pickup: pickupData });
      },
      (err) => {
        this.notifierService.showNotification("Error creating pickup, please try again.", "ok", 4000);
        console.log(err);
        this.loading = false;
        this.embarkAddress = undefined;
        this.returnAddress = undefined;
        this.embarkLat = undefined;
        this.embarkLng = undefined;
        this.dialogRef.close({ createSuccessful: false });
      }
    );
  }
}
