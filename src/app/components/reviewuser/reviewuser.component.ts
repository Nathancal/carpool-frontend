import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-reviewuser',
  templateUrl: './reviewuser.component.html',
  styleUrls: ['./reviewuser.component.css'],
})
export class ReviewuserComponent implements OnInit {
  constructor(private fb: FormBuilder, public reviewService: ReviewService) {}
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      comment: new FormControl(),
      score: new FormControl(),
    });
  }

  submitReview() {
    // this.reviewService.addReview()
  }
}
