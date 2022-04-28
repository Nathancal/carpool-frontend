import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserprofileComponent } from '../userprofile/userprofile.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  viewUserProfile() {
    const configDialog = new MatDialogConfig();

    configDialog.height = '700px';
    configDialog.width = '100%';

    const modal = this.dialog.open(UserprofileComponent, configDialog);
  }

  viewUserHostedPickups() {}

  viewUserMessages() {}
}
