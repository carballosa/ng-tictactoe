import { Component, Input } from '@angular/core';

@Component({
  selector: 'square',
  template: `
    <button class="square" (click)="onClick()" >{{value}}</button>
  `,
})
export class SquareComponent {
  @Input() value;
  @Input() onClick: Function;
}

@Component({
  selector: 'board',
  template: `
    <div>
      <div class="board-row" *ngFor="let j of [0,1,2]">
        <square *ngFor="let i of [0,1,2]"
          [value]="squares[i+3*j]"
          [onClick]="onClick(i+3*j)"
        ></square>
      </div>
    </div>
  `,
})
export class BoardComponent {
  @Input() squares;
  @Input() onClick: Function;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

@Component({
  selector: '#root',
  template: `
    <div class="game">
      <div class="game-board">
        <board
          [squares]="state.history[state.history.length-1].squares"
          [onClick]="handleClick"
        ></board>
      </div>
      <div class="game-info">
        <div>{{status}}</div>
        <ol>
          <li *ngFor="let step of state.history, index as move">
            <button (click)="backTo(move)" >
              go back to {{(!move)?'start':'step '+move}}
            </button>
          </li>
        </ol>
      </div>
    </div>
  `
})
export class GameComponent {
  title = 'tic-tac-toe';
  state = {
    history: [{
      squares: Array(9).fill(null),
    }],
    nextPlayer: 'X',
    winner: null,
    stepNumber: 0,
  };
  status = 'Next player: X';
  backTo = (step) => {
    this.state = {
      ...this.state,
      nextPlayer: (step % 2) ? 'O' : 'X',
      winner: null,
      stepNumber: step,
    };
  }
  handleClick = (i) => () => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares;
    // tslint:disable-next-line:curly
    if (this.state.winner || squares[i]) return;
    squares = squares.slice(); // clone
    const player = this.state.nextPlayer;
    squares[i] = player;
    const winner = calculateWinner(squares);
    const nextPlayer = (player  === 'X') ? 'O' : 'X';
    this.status = winner ? `Winner: ${winner}` : `Next player: ${nextPlayer}`;
    this.state = {
      history: history.concat([{ squares }]),
      nextPlayer,
      winner,
      stepNumber: history.length,
    };
  }
}
