import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(public httpClient: HttpClient) {}

  HTTPS_URL = 'https://192.168.0.21:5000/api/v1/userrating/';

  addReview(userRecepId: any, comment: any, userPostId: any, score: any) {
    this.httpClient.post(this.HTTPS_URL + 'rateuser', {
      userId: userPostId,
      userUnderReviewId: userRecepId,
      comment: comment,
      score: score,
    });
  }

  updateAvgRating(userRecepId: any) {
    this.httpClient.post(this.HTTPS_URL + 'setscore', {
      userId: userRecepId,
    });
  }

  getUserRating(userId: any) {
    this.httpClient.post(this.HTTPS_URL + 'getscore', {
      userId: userId
    });
  }
}
