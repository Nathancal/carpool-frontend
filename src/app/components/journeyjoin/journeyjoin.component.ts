import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JourneyService } from 'src/app/services/journey.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { PickupService } from 'src/app/services/pickup.service';

@Component({
  selector: 'app-journeyjoin',
  templateUrl: './journeyjoin.component.html',
  styleUrls: ['./journeyjoin.component.css'],
})
export class JourneyjoinComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public scannerService: ScannerService,
    public journeyService: JourneyService,
    private dialogRef: MatDialogRef<JourneyjoinComponent>,
    private pickupService: PickupService
  ) {}

  private scannerEnabled: boolean = true;

  scans!: any;
  scansParsed: any;
  QRcodeData: any;


  isHost!: boolean;
  forename: any;

  userInfo: any;

  ngOnInit(): void {
    let userId = sessionStorage['userID'];

    this.isHost = this.data.isHost;

    if (!this.isHost) {
      this.generateData();
    }
  }

  generateData() {

    this.userInfo = {
      userId: this.data.userId,
      forename: sessionStorage['userForename'],
      pickupId: this.data.pickup.pickupId,
    };
    this.QRcodeData = JSON.stringify(this.userInfo);
  }

  scanSuccessHandler(event: string) {
    if (!this.scans) {
      this.scans = event;
      this.scansParsed = JSON.parse(this.scans);

      this.pickupService
        .checkUserIsPassenger(
          this.scansParsed.pickupId,
          this.scansParsed.userId
        )
        .subscribe((res: any) => {
          if ((res.isPassenger = true)) {
            this.journeyService
              .joinJourneyHttp(
                this.scansParsed.userId,
                this.scansParsed.forename,
                this.scansParsed.pickupId
              )
              .subscribe((res: any) => {

                this.dialogRef.close({
                  userAdded: this.scansParsed.forename,
                  addSuccessful: true
                });
              });
          }
        });
    } else {
      console.log('scan already completed.');
    }
  }

  closeQR(){
    this.dialogRef.close()
  }

}
