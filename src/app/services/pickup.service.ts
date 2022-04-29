import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  constructor(public http: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/pickup';

  exitPickup(pickupId: any, userId: any) {
    return this.http.post(this.HTTPS_URL + '/exitpickup', {
      pickupId: pickupId,
      userId: userId,
    });
  }

  completePickup(
    userID: any,
    duration: any,
    milesTravelled: any,
    pickupId: any
  ) {
    return this.http.post(this.HTTPS_URL + '/completepickup', {
      userId: userID,
      duration: duration,
      milesTravelled: milesTravelled,
      pickupId: pickupId,
    });
  }

  joinPickup(pickupId: any, userId: any) {
    return this.http.post(this.HTTPS_URL + '/joinpickup', {
      pickupId: pickupId,
      userId: userId,
    });
  }

  checkUserIsPassenger(pickupId: any, userId: any) {
    return this.http.post(this.HTTPS_URL + '/checkuserpassenger', {
      pickupId: pickupId,
      userId: userId,
    });
  }

  getPassengerDetails(passengerId: any) {
    return this.http.post(this.HTTPS_URL + '/getpassengerdetails', {
      passengerId: passengerId,
    });
  }

  getHostDetails(hostId: any, pickupId: any) {
    return this.http.post(this.HTTPS_URL + '/gethostdetails', {
      pickupId: pickupId,
      hostId: hostId,
    });
  }

  getPickupsUserPassenger(userId: any) {
    return this.http.post(this.HTTPS_URL + '/getpickupsuserpassenger', {
      userId: userId,
    });
  }

  getPickupDetails(pickupId: any) {
    return this.http.post(this.HTTPS_URL + '/getpickupdetails', {
      pickupId: pickupId,
    });
  }

  getUserPickups(userId: any) {
    const header = {
      userId: userId,
    };

    return this.http.get(this.HTTPS_URL + '/userhostedpickups', {
      headers: header,
    });
  }

  getPickupsInArea(lat: number, lng: number) {
    return this.http.post(this.HTTPS_URL + '/pickupsatlocation', {
      lat: lat,
      lng: lng,
    });
  }

  createPickup(pickupData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    console.log(pickupData.hostId);
    console.log(pickupData.eLat + ':' + pickupData.eLng);
    console.log(pickupData.rLat + ':' + pickupData.rLng);

    return this.http.post(
      this.HTTPS_URL + '/create',
      {
        hostId: pickupData.hostId,
        eLat: pickupData.eLat,
        eLng: pickupData.eLng,
        embarkAddress: pickupData.embarkAddress,
        returnAddress: pickupData.returnAddress,
        rLat: pickupData.rLat,
        rLng: pickupData.rLng,
        date: pickupData.date,
        time: pickupData.time,
        totalNumPassengers: pickupData.totalNumPassengers,
        address: pickupData.address,
      },
      { headers: header }
    );
  }
}
