import React from 'react';

import boxes from "../data/boxes.json";

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class CardView extends React.Component {
  constructor(props) {
    super(props);
    this.card = props.card;
  }

  render() {
    return (
      <div>{this.card.source} - {this.card.target}</div>
    );
  }
}

class BoxView extends React.Component {
  constructor(props) {
    super(props);
    this.numberOfCards = props.box.cards.length;
  }

  render() {
    return (
      <div>Box: {this.numberOfCards}</div>
    );
  }
}

class Card {
  constructor(source, target) {
    this.source = source;
    this.target = target;
  }

  view() {
    return <CardView key={this.source} card={this} />
  }
}

class Box {
  constructor(number, cards) {
    this.number = number;
    this.cards = cards.map(card =>
      new Card(card.source, card.target)
    );
    this._view = <BoxView key={this.number} box={this} />;
  }

  add(source, target) {
    this.cards.push(new Card(source, target));
  }

  view() {
    return this._view;
  }

  randomCard() {
    return randomChoice(this.cards);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.boxes = boxes.map(box =>
      new Box(box.number, box.cards)
    );
  }

  add(source, target) {
    this.boxes[0].add(source, target);
    console.log(this.boxes);
  }

  randomNonEmptyBox() {
    return randomChoice(this.boxes.filter(box => box.cards.length));
  }

  render() {
    return (
      <div>
        {this.boxes.map(box => box.view())}
        <div style={{border: "1px solid black"}}>
          {this.randomNonEmptyBox().randomCard().view()}
        </div>
        <button onClick={() => this.add("hello", "world")}>Add Card</button>
      </div>
    );
  }
}

export default App;
