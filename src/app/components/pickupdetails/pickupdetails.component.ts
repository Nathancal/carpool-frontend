import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';
import { PickupService } from 'src/app/services/pickup.service';

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
    private dialogRef: MatDialogRef<PickupdetailsComponent>
  ) {
    dialogRef.disableClose = true;
  }

  embarkAddress: any;
  returnAddress: any;
  selectDestination!: boolean;

  loading = false;

  ngOnInit(): void {
    this.reverseGeocode();
    this.selectDestination = this.data.selectDestination;
    //If the data returned already contains an embark address it is added to the dialog and
    //a return address is anticipated
    if(this.data.embarkAddress != undefined){
      this.embarkAddress = this.data.embarkAddress;
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
    this.embarkAddress = false;
    this.returnAddress = false;
    this.dialogRef.close({
      embarkAddress: undefined,
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
        if (this.embarkAddress == undefined) {
          this.embarkAddress = res.addresses[0].address.freeformAddress;
          console.log('Embark address added' + this.embarkAddress);
        } else {
          this.returnAddress = res.addresses[0].address.freeformAddress;
          console.log('Return address added' + this.returnAddress);
        }
      });
  }

  selectDestinationFunc() {
    this.dialogRef.close({
      createSuccessful: false,
      selectDestination: true,
      embarkAddress: this.embarkAddress,
    });
  }

  pickupFormSubmit() {
    this.loading = true;

    console.log(this.pickupForm.value.date);

    let pickupData = {
      hostId: sessionStorage['userID'],
      lat: this.data.lat,
      lng: this.data.lng,
      date: this.pickupForm.value.date,
      embarkAddress: this.embarkAddress,
      returnAddress: this.returnAddress,
      time: this.pickupForm.value.time,
      totalNumPassengers: this.pickupForm.value.numPassengers,
    };

    this.pickupService.createPickup(pickupData).subscribe(
      (res) => {
        this.loading = false;
        this.embarkAddress = undefined;
        this.returnAddress = undefined;
        this.dialogRef.close({ createSuccessful: true, pickup: pickupData });
      },
      (err) => {
        this.loading = false;
        this.embarkAddress = undefined;
        this.returnAddress = undefined;
        this.dialogRef.close({ createSuccessful: false });
      }
    );
  }
}
