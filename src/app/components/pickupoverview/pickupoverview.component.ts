import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pickupoverview',
  templateUrl: './pickupoverview.component.html',
  styleUrls: ['./pickupoverview.component.css']
})
export class PickupoverviewComponent implements OnInit {

  constructor() { }

  latlng: any;
  pickup: any;
  userInfo: any;
  userCreated: any;

  

  ngOnInit(): void {
  }

}
