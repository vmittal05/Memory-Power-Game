import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SquareData } from '../game/square-data';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {


  @Input()
  data!: SquareData;
  @Output() squareClicked:EventEmitter<SquareData> = new EventEmitter<SquareData>();
  color:String='white';
  @Input()
  clickColor!:String;
  constructor() { }
  
  ngOnInit(): void {
  }

  onSquareClicked() {
    if (this.data.state === 'init') {
      this.data.state = 'default';
      // this.data.color = 'yellow';
    }
    else if (this.data.state === 'default') {
      this.data.state = 'clicked';
      this.data.color = this.clickColor;
    }

    this.squareClicked.emit(this.data);
  }

  getState() {
    if (this.data.state === 'clicked') return { 'color': 'yellow' }
    else return {};
  }

}
