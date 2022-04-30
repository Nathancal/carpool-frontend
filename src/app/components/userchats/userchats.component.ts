import { Component, OnInit, Inject } from '@angular/core';
import { ChatsService } from 'src/app/services/chats.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-userchats',
  templateUrl: './userchats.component.html',
  styleUrls: ['./userchats.component.css'],
})
export class UserchatsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public chatService: ChatsService,
    public authService: AuthService,
    public notifierService: NotifierService,
    private fb: FormBuilder
  ) {}

  sendMessage!: boolean;
  userChats!: any[];
  userId: any;
  form!: FormGroup;
  tabs = ['Chats'];
  activeTab = this.tabs[0];
  chatWith: any;
  chatSelected: any;
  userTabOpen!: boolean;
  isLoading!: boolean;

  ngOnInit(): void {
    this.isLoading = true;
    this.form = this.fb.group({
      message: new FormControl(),
      chatId: new FormControl(),
      userId: new FormControl(),
    });

    console.log(this.data.openChat);

    this.userId = sessionStorage['userID'];
    this.getUserChats();
  }

  viewUserTab() {
    this.tabs.push(`Chat with user`);
  }

  clickChat(){

    this.userTabOpen

  }

  getUserChats() {

    this.chatService.getChats(this.userId).subscribe((res: any) => {
      this.userChats = res.data;

      this.userChats.forEach((chat) => {

        if (chat.chatMemberOneId === this.userId) {
          this.authService
            .getUserInfo(chat.chatMemberTwoId)
            .subscribe((res: any) => {
              chat.userInfo = res.data;
              this.isLoading = false;

            });
        }else if(chat.chatMemberTwoId === this.userId){
          this.authService
          .getUserInfo(chat.chatMemberOneId)
          .subscribe((res: any) => {
            chat.userInfo = res.data;
            this.isLoading = false;
          });
        }
      });

    },(err: any)=>{
      this.isLoading = false;
      this.notifierService.showNotification("an error has occoured please try again", "OK", 4000)
    });


  }

  createMessage(chatId: any, message: any, userId: any) {

    this.chatService.createMessage(chatId, message, userId).subscribe((res:any)=>{
      console.log(res)
      this.getUserChats();
    })


  }
}
