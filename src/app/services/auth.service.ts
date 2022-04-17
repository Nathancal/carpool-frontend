import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public http: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/user';

  loginAccount(accountData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    return this.http.post(
      this.HTTPS_URL + '/login',
      {
        email: accountData.email,
        password: accountData.password,
      },
      { headers: header }
    );
  }


  getUserMiles(userId: any){

    return this.http.post(this.HTTPS_URL + '/getmiles', {
      userID: userId
    });
  }

  updateUserMiles(userId: any, userTotalMiles: any){

    return this.http.post(this.HTTPS_URL + "/updatemiles", {
      updateTotalMiles: userTotalMiles,
      userID: userId
    })
  }


  registerAccount(accountData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    console.log(accountData);

    return this.http.post(
      'https://192.168.0.21:5000/api/v1/user/signup',
      {
        email: accountData.email,
        password: accountData.password,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
      },
      { headers: header }
    );
  }
}
