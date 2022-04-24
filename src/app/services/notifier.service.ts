import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private snackbar: MatSnackBar) {}

  showNotification(
    displayMessage: string,
    buttonText: string,
    duration: number
  ) {
    this.snackbar.open(displayMessage, buttonText, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
