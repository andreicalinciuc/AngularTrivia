import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  realAnswer: any;

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit() {
    this.quizService.qns = JSON.parse(localStorage.getItem('qns')).questions;

    if (parseInt(localStorage.getItem('qnProgress')) === this.quizService.qns.length) {
      this.quizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.quizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));

      this.quizService.getAnswers(this.quizService.qns).subscribe(
        (data: any) => {
          this.realAnswer = data.answers;
          this.quizService.correctAnswerCount = 0;
          this.quizService.qns.forEach((e, i) => {
            if (e.answer === data.answers[i].answer) {
              this.quizService.correctAnswerCount++;
            }
            e.correct = data[i];
          });
        }
      );
    } else {
      this.router.navigate(['/quiz']);
    }
  }


  OnSubmit() {
    this.quizService.submitScore().subscribe(() => {
      this.restart();
    });
  }

  restart() {
    localStorage.setItem('qnProgress', '0');
    localStorage.setItem('qns', '');
    localStorage.setItem('seconds', '0');
    this.router.navigate(['/quiz']);
  }

}
