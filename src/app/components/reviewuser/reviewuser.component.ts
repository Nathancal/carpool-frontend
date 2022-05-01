import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-reviewuser',
  templateUrl: './reviewuser.component.html',
  styleUrls: ['./reviewuser.component.css'],
})
export class ReviewuserComponent implements OnInit {
  constructor(private fb: FormBuilder,public notifierService: NotifierService, public reviewService: ReviewService) {}
  form!: FormGroup;

  @Input() passenger: any = [];
  @Input() userId: any = [];



  ngOnInit(): void {
    this.form = this.fb.group({
      comment: new FormControl(),
      score: new FormControl(),
    });
  }

  submitReview() {

    console.log(this.passenger.passengerId);
    this.reviewService.addReview(this.passenger.passengerId,this.form.value.comment,this.userId,this.form.value.score).subscribe((res:any)=>{
      this.notifierService.showNotification("review succesfully added", "Thanks!", 4000);
      this.reviewService.updateAvgRating(this.passenger.passengerId);
    },(err:any)=>{
      this.notifierService.showNotification("a problem occoured adding the review", "ok", 4000);
    });
  }
}
