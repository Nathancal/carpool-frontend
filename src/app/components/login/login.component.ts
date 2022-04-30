import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BarcodeFormat } from '@zxing/library';
import { NotifierService } from 'src/app/services/notifier.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, public notifierService: NotifierService, private router: Router) { }

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
    },(err: any)=>{
      this.notifierService.showNotification("unable to create account, please try again", "ok", 5000);
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
      sessionStorage["userForename"] = res.firstName;
      sessionStorage["token"] = res.token;

      this.authService.setAuth(sessionStorage["token"]);

      console.log(sessionStorage["userForename"]);
      this.loading = false;
      this.router.navigateByUrl('/userdashboard');
    }, (err:any)=>{
      this.notifierService.showNotification("unable to login please try again", "ok", 5000);
    })

  }

}
