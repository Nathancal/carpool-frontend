import { Component, OnInit, Inject } from '@angular/core';
import { JourneyService } from 'src/app/services/journey.service';
import { map } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JourneyjoinComponent } from '../journeyjoin/journeyjoin.component';



@Component({
  selector: 'app-journeydetail',
  templateUrl: './journeydetail.component.html',
  styleUrls: ['./journeydetail.component.css']
})
export class JourneydetailComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,public journeyService: JourneyService,private dialogRef: MatDialogRef<JourneydetailComponent>) {
    dialogRef.disableClose = true;
   }

  ping: any
  pickupId: any;
  userId: any;
  userForename: any
  response: any = [];
  numPassengersJoined: any;
  passengersJoined: any;

  isHost!: boolean;



  ngOnInit(): void {

    this.userId = sessionStorage["userID"]
    this.userForename = sessionStorage["userForename"];



    if(this.userId == this.data.pickup.hostId){
      this.isHost = true;
    }else if(this.userId != this.data.pickup.hostId){
      this.isHost = false;
    }

    this.journeyService.getJourneyMessages().subscribe((data: any)=>{
      console.log(data);
      if(!this.response.includes(data.userId)){
        this.passengersJoined = data.users
        this.response.push({'userId': data.userId, 'forename': data.forename });
        this.numPassengersJoined = data.users.length;
      }

    })

  }

  joinJourney(){
    let userId = sessionStorage["userID"];

    const configDialog = new MatDialogConfig();

    configDialog.id = 'scanqrcodemodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.data.pickup,
      userId: this.userId,
      forename: this.userForename,
      isHost: this.isHost
    };
    const modal = this.dialog.open(JourneyjoinComponent, configDialog);

    this.journeyService.joinJourneyHttp(userId,this.userForename,this.data.pickup.pickupId).subscribe((res:any)=>{
       this.journeyService.joinJourneySocket(userId, this.userForename, this.data.pickup.pickupId)
    })
  }

  scanPassengerModal(){


    const configDialog = new MatDialogConfig();

    configDialog.id = 'scanqrcodemodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.data.pickup,
      userId: this.userId,
      forename: this.userForename,
      isHost: this.isHost
    };
    const modal = this.dialog.open(JourneyjoinComponent, configDialog);

  }

  goToUser(){
    //TODO
  }

}
