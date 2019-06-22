import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../shared/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  constructor(private router: Router, private quizService: QuizService) {}

  ngOnInit() {

    if (parseInt(localStorage.getItem('seconds')) > 0) {
      this.quizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.quizService.qnProgress = 0;
      const data = JSON.parse(localStorage.getItem('qns'));
      this.quizService.qns = data.questions;
      if (this.quizService.qnProgress === 10) { this.router.navigate(['/result']); } else { this.startTimer(); }
    } else {
      this.quizService.seconds = 0;
      this.quizService.qnProgress = 0;
      this.quizService.getQuestions().subscribe((data: any) => {
        localStorage.setItem('qns', JSON.stringify(data));
        this.quizService.qns = data.questions;
        this.startTimer();
      });
    }
  }

  startTimer() {
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
      localStorage.setItem('seconds', this.quizService.seconds.toString());
    }, 1000);
  }

  Answer(id, choice) {
    this.quizService.qns[this.quizService.qnProgress].answer = choice;
    localStorage.setItem('qns', JSON.stringify({ success: true, questions: this.quizService.qns }));

    if (this.quizService.qnProgress === this.quizService.qns.length - 1) {
      clearInterval(this.quizService.timer);
      this.router.navigate(['/result']);
    }

    if (this.quizService.qnProgress <= this.quizService.qns.length - 1) {
      this.quizService.qnProgress++;
    }
    localStorage.setItem('qnProgress', this.quizService.qnProgress.toString());
  }
}
