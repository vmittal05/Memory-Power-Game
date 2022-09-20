import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SquareData } from './square-data';
import { GAME_STATE } from './constants'
import { SquareComponent } from '../square/square.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  squares: SquareData[] = [];
  @ViewChildren('grid') gridEl!: QueryList<SquareComponent>;
  gridArray: SquareComponent[] = [];
  row = 3;
  col = 3;
  level = 1;
  move = 0;
  lives = 5;
  compSeq: Array<number> = [];
  userSeq: Array<number> = [];
  started: boolean = false;
  seqInd = 0;
  currColor = 'yellow';
  colors = ["yellow", "red", "blue", "lime", "olive", "orange", "black", "teal", "purple"];
  colorInd = 0;
  constructor(private router: Router, private changeDetector: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    // this.gridEl.forEach(div => div.onSquareClicked()
    // )
    this.gridEl.changes.subscribe(() => {
      console.log("DOM updated");
      this.gridArray = this.gridEl.toArray();
      // console.log(this.gridArray);
    })
    this.gridArray = this.gridEl.toArray();
  }

  ngOnInit(): void {
    let obj: SquareData = {
      color: 'white',
      state: 'default'
    }
    for (let index = 0; index < this.row * this.col; index++) {
      this.squares.push({ ...obj });
    }

  }

  squareClicked(index: number, event: SquareData): void {

    const squareInfo = this.squares[index];
    // console.log(index, event.color, event.state);
    if (this.compSeq.length > 0) {
      if (squareInfo.state === 'clicked') {
        // squareInfo.state='clicked';
        if (index !== this.compSeq[this.seqInd++]) {
          window.alert("Wrong !");
          this.lives--;
          this.resetBoard();
          if (this.lives == 0) {
            this.reset();
            window.alert("You Lost !");
            return;
          }
          this.genSeq();
        }
        this.userSeq.push(index);
      }
      if (this.seqInd === this.compSeq.length) {
        window.alert("Correct !");
        this.resetBoard();
        let obj: SquareData = {
          color: 'white',
          state: 'default'
        }
        this.row += 1;
        this.level += 1;
        this.colorInd = Math.floor(Math.random() * (this.colors.length));
        this.currColor = this.colors[this.colorInd];
        for (let i = 0; i < this.col; i++)
          this.squares.push({ ...obj });

        this.genSeq();
      }
    } else {
      window.alert("Click on Start button to start the game !")
      this.reset();
    }
    // console.log("UserSequence: ", this.userSeq)
    if (this.level == 6) {
      window.alert("You Win");
      this.reset();
    }
  }

  async genSeq() {
    await this.timeout(300);
    for (let ind of this.compSeq) {
      await this.timeout(500);
      this.gridArray[ind].color = this.colors[this.colorInd];
    }

    while (this.move < this.row) {
      if (this.compSeq.length === this.row * this.col) break;
      let ind = Math.floor(Math.random() * (this.row * this.col));
      if (this.compSeq.includes(ind)) {
        console.log("Coninuing");
        continue;
      };
      // this.squares[ind].color = "blue";
      await this.timeout(500);
      this.gridArray[ind].color = this.colors[this.colorInd];
      this.compSeq.push(ind);
      this.move++;
    }
    await this.timeout(1000);
    this.resetBoard();
    console.log(this.compSeq);

  }

  resetBoard() {
    if (this.gridArray.length !== 0) {
      this.gridArray.forEach(
        (el) => {
          el.color = 'white';
          el.data.state = 'default';
        }
      )
    } else {
      console.log("Length is 0");
    }
    this.userSeq.length = 0;
    this.seqInd = 0;
  }

  timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset() {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['play'])
  }

}
