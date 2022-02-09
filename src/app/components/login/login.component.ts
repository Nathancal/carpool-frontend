import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BarcodeFormat } from '@zxing/library';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  loading = false;
  Testing = "test";


  ngOnInit(): void {
  }

  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    forename: new FormControl('', [
      Validators.required
    ]),
    lastName: new FormControl('', [
      Validators.required
    ])
  })

  loginForm = new FormGroup({
    email: new FormControl('',[
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })


  registerAccount(){

    this.loading = true;

    let accountData = {
      'email': this.registerForm.value.email,
      'password': this.registerForm.value.password,
      'firstName': this.registerForm.value.forename,
      'lastName': this.registerForm.value.lastName
    }

    this.authService.registerAccount(accountData).subscribe((res)=>{
      console.log(res);
      this.loading = false;
    })
  }

  loginAccount(){
    this.loading = true;

    let accountData = {
      'email': this.loginForm.value.email,
      'password': this.loginForm.value.password
    }

    this.authService.loginAccount(accountData).subscribe((res: any)=>{
      console.log(res);
      console.log(res.userId);
      sessionStorage["userID"] = res.userId;

      console.log(sessionStorage["userID"])
      sessionStorage["token"] =res.token;
      this.loading = false;
      this.router.navigateByUrl('/userdashboard');
    }, (err:any)=>{
      console.log(err)
    })

  }

}
