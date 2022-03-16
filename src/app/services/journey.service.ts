import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  constructor(private socket: Socket, public http: HttpClient) {
    this.socket.on('connect_failed', (data:any) =>{console.log(data)})
  }

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/journey';

  public message$: BehaviorSubject<any> = new BehaviorSubject({});



  joinJourneyHttp(userId: any, userForename: any, pickupId: any) {
    console.log(userId);
    console.log(pickupId);
    console.log(userForename);
    return this.http.post(this.HTTPS_URL + '/join', {
      pickupId: pickupId,
      userId: userId,
      userForename: userForename,
    });
  }

  joinJourneySocket(userId: any,forename: any, pickupId: any) {
    let message = {
      'forename': forename,
      'pickupId': pickupId,
      'userId': userId
    }


    return this.socket.emit('joined', message);

  }

  getJourneyMessages(){

   return this.socket.fromEvent('joined').pipe(map((data) => data));
  }

  journeyStart(){
    this.socket.on('start', (message:any)=>{

    })
  }

}
