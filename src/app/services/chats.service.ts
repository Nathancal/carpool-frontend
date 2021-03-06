import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(public http: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/chat';

  getChats(userId: any) {
    return this.http.post(this.HTTPS_URL + '/getchatsuser', {
      userId: userId,
    });
  }

  checkChatExists(userId: any, recepUserId: any) {
    return this.http.post(this.HTTPS_URL + '/checkchatexists', {
      userId: userId,
      recepUserId: recepUserId,
    });
  }

  createMessage(chatId: any, message: any, userId: any) {
    return this.http.post(this.HTTPS_URL + '/createmessage', {
      chatId: chatId,
      message: message,
      userId: userId,
    });
  }

  createChat(userId: any, recepUserId: any) {
    console.log(userId);
    console.log(recepUserId);
    return this.http.post(this.HTTPS_URL + '/createchat', {
      userId: userId,
      userSelectedId: recepUserId,
    });
  }
}
