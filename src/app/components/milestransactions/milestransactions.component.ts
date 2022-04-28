import { Component, OnInit,Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-milestransactions',
  templateUrl: './milestransactions.component.html',
  styleUrls: ['./milestransactions.component.css']
})
export class MilestransactionsComponent implements OnInit {

  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  public authService: AuthService) { }

  userId: any;
  transactionList: any;

  ngOnInit(): void {

    this.userId = sessionStorage["userID"]
    this.transactionList = this.data.transactionList;




  }

}
