import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public http: HttpClient) {}

  loginAccount(accountData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    return this.http.post(
      'http://192.168.0.21:5000/api/v1/user/login',
      {
        email: accountData.email,
        password: accountData.password,
      },
      { headers: header }
    );
  }

  registerAccount(accountData: any) {
    const header = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '4200',
    };

    console.log(accountData);

    return this.http.post(
      'http://192.168.0.21:5000/api/v1/user/signup',
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
