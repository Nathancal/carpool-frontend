import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  constructor(public http: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/carpool'


  initCarpool(pickupEmbarkId: any, pickupReturnId: any){

    return this.http.post(this.HTTPS_URL +'/initcarpool', {
      "embarkPickupId": pickupEmbarkId,
      "returnPickupId": pickupReturnId,
      "hostId": sessionStorage["userID"]
    })

  }

}
