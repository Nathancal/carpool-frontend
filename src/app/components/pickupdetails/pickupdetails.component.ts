import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pickupdetails',
  templateUrl: './pickupdetails.component.html',
  styleUrls: ['./pickupdetails.component.css']
})
export class PickupdetailsComponent implements OnInit {

  constructor() { }

  model!: User;

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
