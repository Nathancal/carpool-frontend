import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {

  private scannerEnabled: boolean = true;
  scans!: string;


  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  scanSuccessHandler(event: string){
    this.scans = event;
    console.log(event);
    console.log(this.scans);
  }

}
