import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrgenerator',
  templateUrl: './qrgenerator.component.html',
  styleUrls: ['./qrgenerator.component.css']
})
export class QrgeneratorComponent implements OnInit {

  testing = "";
  testingObject = {
    "userId": "testid",
    "createdAt": "0000-00-0000",
    "miles": "15"
  };
  constructor() { }

  ngOnInit(): void {
    this.testing = JSON.stringify(this.testingObject);
  }

}
