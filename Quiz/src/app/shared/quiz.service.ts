import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuizService {
  // ---------------- Properties---------------
  readonly rootUrl = 'http://localhost:2690';
  qns: any[];
  seconds: number;
  timer;
  qnProgress: number;
  correctAnswerCount = 0;

  // ---------------- Helper Methods---------------
  constructor(private http: HttpClient) {}
  displayTimeElapsed() {
    return (
      Math.floor(this.seconds / 3600) +
      ':' +
      Math.floor(this.seconds / 60) +
      ':' +
      Math.floor(this.seconds % 60)
    );
  }

  getParticipantName() {
    const participant = JSON.parse(localStorage.getItem('participant'));
    return participant.Name;
  }

  // ---------------- Http Methods---------------

  insertParticipant(name: string, email: string) {
    const body = {
      name,
      email
    };

    return this.http.post(this.rootUrl + '/users/register', body);
  }

  getQuestions() {
    return this.http.get(this.rootUrl + '/questions');
  }

  getAnswers(questions) {
    const body = {
      questions
    };
    return this.http.post(this.rootUrl + '/answers', body);
  }

  submitScore() {
    const body = JSON.parse(localStorage.getItem('participant'));
    console.log(body);
    body.Score = this.correctAnswerCount;
    body.TimeSpent = this.seconds;
    return this.http.post(this.rootUrl + '/update', body);
  }
}
