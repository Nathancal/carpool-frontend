import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class PickupService {

  constructor(public http: HttpClient) { }

  getUserPickups(userId: any){

    const header = {
      'userId': userId
    }

    return this.http.get('http://127.0.0.1:5000/api/v1/pickup/userhostedpickups', {headers:header})

  }

  createPickup(pickupData: any){

    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200'
    }

    console.log(pickupData.hostId);


    return this.http.post('http://127.0.0.1:5000/api/v1/pickup/create', {
      'hostId': pickupData.hostId,
      'lat': pickupData.lat,
      'lng': pickupData.lng,
      'date': pickupData.date,
      'time': pickupData.time,
      'address': pickupData.address
    },
    {headers: header})

  }
}
