import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-journeyjoin',
  templateUrl: './journeyjoin.component.html',
  styleUrls: ['./journeyjoin.component.css']
})
export class JourneyjoinComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  isHost!: boolean;
  forename: any;

  userInfo: any;

  ngOnInit(): void {

    this.isHost = this.data.isHost

    this.userInfo = {
      "userId": this.data.userId,
      "forename": this.data.userForename,
      "pickupId": this.data.pickup.pickupId
    }
  }

  generateData(){

  }

}
