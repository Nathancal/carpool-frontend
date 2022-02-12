import { Component, OnInit } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';

@Component({
  selector: 'app-pickupoverview',
  templateUrl: './pickupoverview.component.html',
  styleUrls: ['./pickupoverview.component.css']
})
export class PickupoverviewComponent implements OnInit {

  constructor(public pickupService: PickupService) { }

  latlng: any;
  pickup: any;
  userInfo: any;
  userCreated: any;



  ngOnInit(): void {
  }

  joinPickup(pickupId: any ){
    const userId = sessionStorage["userID"]
    this.pickupService.joinPickup(pickupId, userId).subscribe((res) =>{

    })

  }
}
