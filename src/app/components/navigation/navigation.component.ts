import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserprofileComponent } from '../userprofile/userprofile.component';
import { AuthService } from 'src/app/services/auth.service';
import { PickupService } from 'src/app/services/pickup.service';
import { UserpassengerpickuplistComponent } from '../userpassengerpickuplist/userpassengerpickuplist.component';
import { UserchatsComponent } from '../userchats/userchats.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public pickupService: PickupService,
    private dialog: MatDialog
  ) {}

  userId: any;
  userPickupList: any;
  userInfo: any;
  userPassengerPickupList!: any[];

  ngOnInit(): void {
    this.userId = sessionStorage['userID'];
    this.getUserPickups();
    this.getUserInfo();

    this.pickupService
      .getPickupsUserPassenger(this.userId)
      .subscribe((res: any) => {
        console.log(res);
        this.userPassengerPickupList = res.data;

        this.userPassengerPickupList.forEach((pickup: any) => {
          this.pickupService
            .getHostDetails(pickup.hostId, pickup.pickupId)
            .subscribe((res: any) => {
              pickup.hostInfo = res.data;
            });
        });
      });
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  viewUserProfile() {
    const configDialog = new MatDialogConfig();

    configDialog.height = '80%';
    configDialog.width = '100%';
    configDialog.data = {
      userPickupList: this.userPickupList,
      userInfo: this.userInfo,
    };

    const modal = this.dialog.open(UserprofileComponent, configDialog);
  }

  viewUserPassengerPickupList() {
    const configDialog = new MatDialogConfig();

    configDialog.height = '80%';
    configDialog.width = '100%';
    configDialog.data = {
      userPassengerPickupList: this.userPassengerPickupList,
    };

    const modal = this.dialog.open(
      UserpassengerpickuplistComponent,
      configDialog
    );
  }

  viewUserMessages() {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'userchatsmodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'user-chats-modal-container';
    configDialog.data = {
      userId: this.userId,
      openChat: false,
    };
    const modal = this.dialog.open(UserchatsComponent, configDialog);
  }

  getUserPickups() {
    this.pickupService.getUserPickups(this.userId).subscribe((res: any) => {
      console.log(res);
      this.userPickupList = res.data;
    });
  }

  getUserInfo() {
    this.authService.getUserInfo(this.userId).subscribe((res: any) => {
      console.log(res);
      this.userInfo = res.data;
    });
  }
}
