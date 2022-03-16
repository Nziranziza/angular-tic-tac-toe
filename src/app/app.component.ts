import { Component } from '@angular/core';

type Player = 'X' | 'Y';
type Row = (Player | '')[];
type Board = Row[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tic-tac-toe';
  board: Board = localStorage.getItem('board') ? JSON.parse(localStorage.getItem('board') || '') : [
    ['', '', ''], // row
    ['', '', ''],
    ['', '', '']
  ];
  winner: (Player | '') = '';
  xPlayer: Player = 'X';
  yPlayer: Player = 'Y';
  nextPlayer: Player = localStorage.getItem('nextPlayer') === this.xPlayer ? this.xPlayer : this.yPlayer;
  draw: boolean = false;

  constructor() {
    this.getWinner();
  }

  // Update the board with player value
  // Switch the players
  // get the winner
  onCellClick (x: number, y: number) {
    this.board[x][y] = this.nextPlayer;
    this.nextPlayer = this.nextPlayer === this.xPlayer ? this.yPlayer : this.xPlayer;
    localStorage.setItem('nextPlayer', this.nextPlayer);
    localStorage.setItem('board', JSON.stringify(this.board));
    this.getWinner();
  }

  reset() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.nextPlayer = 'X';
    this.winner = '';
    this.draw = false;
    localStorage.setItem('nextPlayer', this.nextPlayer);
    localStorage.setItem('board', JSON.stringify(this.board));
  }


  // Check rows
  // Check columns
  // Check diagonals
  getWinner() {
    for(let x: number = 0; x < this.board.length; x++) {
      // Check for rows
      this.winner = this.whoWon(this.board[x]);
      if(this.winner) {
        return;
      }

      // Check for columns
      const col = this.board.map((_, y) => this.board[y][x]);
      this.winner = this.whoWon(col);
      if(this.winner) {
        return;
      }
    }
    // Check for diagonal
    const diagonals: Row[] = [this.board.map((_, index) => this.board[index][index])];
    diagonals.push(this.board.map((_, index) => this.board[index][this.board.length - 1 - index]));

    for(let i: number = 0; i < diagonals.length; i++) {
      const diagonal=diagonals[i]
      this.winner = this.whoWon(diagonal);
      if(this.winner) {
        return;
      }
    }

    // Check for a draw
    this.draw = !this.board.find((row) => {
      return row.find(col => col === '') === ''
    });
  }

  whoWon(row: Row) {
    const rowLength = row.length;
      const { X, Y } = row.reduce((prev, cur) => {
        if (!cur) {
          return prev
        }
        return {
          ...prev,
          [cur]: prev[cur] + 1
        }
      }, { X: 0, Y: 0 });

      if (X === rowLength) {
        return this.xPlayer;
      }
      if (Y === rowLength) {
        return this.yPlayer;
      }
      return '';
  }
}
