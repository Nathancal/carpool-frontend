import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  model: any

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.model = new User(
      form.form.value.email,
      form.form.value.password,
      form.form.value.firstName,
      form.form.value.lastName
    );
  }

}
