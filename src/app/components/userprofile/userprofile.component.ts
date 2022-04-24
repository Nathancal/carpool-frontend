import { Component, OnInit } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(public pickupService: PickupService, public authService: AuthService) { }

  userPickupList: any;

  ngOnInit(): void {
    this.getUserPickups
  }

  getUserPickups(){

    let userId = sessionStorage["userId"]

    this.pickupService.getUserPickups(userId).subscribe((res:any)=>{
      console.log(res)
      this.userPickupList = res;
    })

  }

}
