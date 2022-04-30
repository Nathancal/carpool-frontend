import { Component, OnInit, Inject } from '@angular/core';
import { ChatsService } from 'src/app/services/chats.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-userchats',
  templateUrl: './userchats.component.html',
  styleUrls: ['./userchats.component.css'],
})
export class UserchatsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public chatService: ChatsService
  ) {}

  sendMessage!: boolean;
  userChats!: any[];
  userId: any;

  ngOnInit(): void {

    console.log(this.data)

    this.userId = sessionStorage['userID'];
  }

  getUserChats() {
    this.chatService.getChats(this.userId).subscribe((res: any) => {
      this.userChats = res.data;
    });
  }
}
