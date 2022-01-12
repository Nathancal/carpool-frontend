import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

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
    surname: new FormControl('', [
      Validators.required
    ])
  })

  registerAccount(){

  }

}
