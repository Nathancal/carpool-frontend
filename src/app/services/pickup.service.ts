import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  constructor(public http: HttpClient) {}

  exitPickup(pickupId: any, userId: any){

    return this.http.post('https://192.168.0.21:5000/api/v1/pickup/exitpickup', {
      "pickupId": pickupId,
      "userId": userId
    })
  }

  joinPickup(pickupId: any, userId: any){

    return this.http.post(
      'https://192.168.0.21:5000/api/v1/pickup/joinpickup',{
        "pickupId": pickupId,
        "userId": userId
      }

    );  }

  getHostDetails(hostId:any, pickupId:any){

    return this.http.post(
      'https://192.168.0.21:5000/api/v1/pickup/gethostdetails',{
        "pickupId": pickupId,
        "hostId": hostId
      }

    );

  }

  getUserPickups(userId: any) {
    const header = {
      userId: userId,
    };

    return this.http.get(
      'https://192.168.0.21:5000/api/v1/pickup/userhostedpickups',
      { headers: header }
    );
  }

  getPickupsInArea(lat: number, lng: number) {

    return this.http.post(
      'https://192.168.0.21:5000/api/v1/pickup/pickupsatlocation',
      { lat: lat, lng: lng }
    );
  }

  createPickup(pickupData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    console.log(pickupData.hostId);

    return this.http.post(
      'https://192.168.0.21:5000/api/v1/pickup/create',
      {
        hostId: pickupData.hostId,
        lat: pickupData.lat,
        lng: pickupData.lng,
        date: pickupData.date,
        time: pickupData.time,
        totalNumPassengers: pickupData.totalNumPassengers,
        address: pickupData.address,
      },
      { headers: header }
    );
  }
}
