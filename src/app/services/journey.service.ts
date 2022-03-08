import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  constructor(private socket: Socket, public http: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/journey';


  joinJourneyHttp(userId: any, userForename: any) {
    this.joinJourneySocket();
    return this.http.post(this.HTTPS_URL + '/join', {
      userId: userId,
      userForename: userForename,
    });
  }

  joinJourneySocket() {
    return this.socket.emit('joined');
  }

  getUserJoined(){
    return this.socket.fromEvent('joined').pipe(map((data) =>{data}))
  }
}
