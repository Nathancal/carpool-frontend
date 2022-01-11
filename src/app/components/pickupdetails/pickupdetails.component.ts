import { Component, Inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-pickupdetails',
  templateUrl: './pickupdetails.component.html',
  styleUrls: ['./pickupdetails.component.css']
})
export class PickupdetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  model!: User;

  ngOnInit(): void {

    console.log("data output")
    console.log(this.data.lat)
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
