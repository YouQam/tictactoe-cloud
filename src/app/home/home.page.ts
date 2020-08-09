import { Component, Input, } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  squares: string[];
  xIsNext: boolean;
  winner: string;
  draw: boolean;
  xORo = '';
  value = 'U';
  listStatus: boolean = false;
  otherPlayer = '';
  lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];


  constructor(private socket: Socket) {

    this.getMessages().subscribe(message => {
      console.log('this.getMessages', message)
    });

    this.getPlayAgainMessage().subscribe(message => {
      console.log('this.getPlayAgainMessage', message)
      this.newGame();
    });
  }

  ngOnInit() {
    this.newGame();
  }

  // When user select either X or O
  onSelectXorO() {
    console.log('onSelectXorO', this.xORo);

    this.listStatus = true; // disable list

    if (this.xORo == "X") {
      this.value = 'X';
      this.otherPlayer = 'O'
      this.xIsNext = true;
    } else {
      this.value = 'O';
      this.otherPlayer = 'X'
      this.xIsNext = false;
    }
    this.joinChat();
  }

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-xORo', this.xORo);

  }

  onSendSelectedBox(index: number) {
    console.log("sendMessage: ", index, "from: ", this.xORo);
    this.socket.emit('add-movement', { index: index });
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        this.onReceivedSelectedBox(data['index'], data['from']);
        observer.next(data);
      });
    })
    return observable;
  }

  onReceivedSelectedBox(recIndex: number, recChar) {
    if (!this.squares[recIndex]) {
      this.squares.splice(recIndex, 1, recChar);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.draw = false;

    /// To play again
    if (this.xORo) {
      if (this.xORo == "X") {
        this.value = 'X';
        this.otherPlayer = 'O'
        this.xIsNext = true;
      } else {
        this.value = 'O';
        this.otherPlayer = 'X'

        this.xIsNext = false;
      }
    }
  }

  onMakeMovement(idx: number) {
    // let player wait for the other one to play
    if (this.xIsNext) {
      if (!this.squares[idx]) {
        this.onSendSelectedBox(idx);
        this.squares.splice(idx, 1, this.xORo);
        this.xIsNext = !this.xIsNext;
      }
      this.winner = this.calculateWinner();
    }
  }

  calculateWinner() {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i];

      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    // Check if game result is draw
    this.checkDraw();

    return null;
  }

  // Check draw
  checkDraw() {
    let found = this.squares.filter(t => t == null).length // Check if the task is already in the list
    if (found == 0) {
      this.draw = true;
    }
  }

  onPlayAgain() {
    this.socket.emit('send-play-again');
  }

  getPlayAgainMessage() {
    let observable = new Observable(observer => {
      this.socket.on('trigger-play-again', () =>
        observer.next()
      );
    })
    return observable;
  }

}
