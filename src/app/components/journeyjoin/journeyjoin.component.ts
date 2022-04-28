import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JourneyService } from 'src/app/services/journey.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { PickupService } from 'src/app/services/pickup.service';
import { NotifierService } from 'src/app/services/notifier.service';

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
    public dialogRef: MatDialogRef<JourneyjoinComponent>,
    private pickupService: PickupService,
    public notifierService: NotifierService
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
      this.notifierService.showNotification("You have successfully scanned this QR code", "Great!", 4000);
      this.dialogRef.close();
    }
  }

  closeQR(){
    this.dialogRef.close()
  }

}
