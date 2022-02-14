import { Component, OnInit } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';

@Component({
  selector: 'app-pickupoverview',
  templateUrl: './pickupoverview.component.html',
  styleUrls: ['./pickupoverview.component.css'],
})
export class PickupoverviewComponent implements OnInit {
  constructor(public pickupService: PickupService) {}

  latlng: any;
  pickup: any;
  userInfo: any;
  userCreated: any;

  ngOnInit(): void {
    this.loadPassengerInfo();
  }

  joinPickup(pickupId: any) {
    console.log('button clicked');

    const userId = sessionStorage['userID'];
    this.pickupService.joinPickup(pickupId, userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  exitPickup(pickupId: any) {
    const userId = sessionStorage['userID'];
    this.pickupService.exitPickup(pickupId, userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadPassengerInfo() {
    const userId = sessionStorage['userID'];
    this.pickup.passengers.forEach((passenger: any) => {
      this.pickupService.getPassengerDetails(passenger.passengerId).subscribe((res: any)=>{
        passenger.passengerDetails = res.data;
      });
    });

  }

  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
