import { Component, Input } from '@angular/core';

@Component({
  selector: 'square',
  template: `
    <button class="square" (click)="onClick()" >
      {{value}}
    </button>
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
      <div class="status">{{status}}</div>
      <div class="board-row" *ngFor="let j of [0,1,2]">
        <square *ngFor="let i of [0,1,2]"
          [value]="state.squares[i+3*j]"
          [onClick]="handleClick(i+3*j)"
        ></square>
      </div>
    </div>
    `,
})
export class BoardComponent {
  state = {
    squares: Array(9).fill(null),
    nextPlayer: 'X',
    winner: null
  };
  status = 'Next player: X';
  handleClick = (i) => {
    const handler = () => {
      let squares = this.state.squares;
      // tslint:disable-next-line:curly
      if (this.state.winner || squares[i]) return;
      squares = squares.slice(); // clone
      const player = this.state.nextPlayer;
      squares[i] = player;
      const winner = this.calculateWinner(squares);
      const nextPlayer = (player  === 'X') ? 'O' : 'X';
      this.status = winner ? `Winner: ${winner}` : `Next player: ${nextPlayer}`;
      this.state = { squares, nextPlayer, winner };
    };
    return handler.bind(this);
  }
  calculateWinner(squares) {
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
}

@Component({
  selector: '#root',
  template: `
    <div class="game">
      <div class="game-board">
        <board></board>
      </div>
      <div class="game-info">
        <div></div>
        <ol></ol>
      </div>
    </div>
  `
})
export class GameComponent {
  title = 'tic-tac-toe';
}
