import React from 'react';

import boxes from "../data/boxes.json";

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: props.source,
      target: props.target
    };
  }

  setCard(source, target) {
    this.setState({
      source: source,
      target: target
    });
  }

  render() {
    return (
      <div>{this.state.source} - {this.state.target}</div>
    );
  }
}

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {numberOfCards: props.numberOfCards};
  }

  setNumberOfCards(n) {
    this.setState({numberOfCards: n});
  }

  render() {
    return (
      <div>Box: {this.state.numberOfCards}</div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.boxes = boxes;
    this.boxRefs = this.boxes.map(box => React.createRef());
    this.cardRef = React.createRef();
  }

  randomNonEmptyBox() {
    return randomChoice(this.boxes.filter(box => box.cards.length));
  }

  randomCardFromBox(box) {
    return randomChoice(box.cards);
  }

  randomCard() {
    const box = this.randomNonEmptyBox();
    return this.randomCardFromBox(box);
  }

  addCard(source, target) {
    this.boxes[0].cards.push({
      source: source,
      target: target
    });
    this.boxRefs[0].current.setNumberOfCards(this.boxes[0].cards.length);
  }

  showRandomCard() {
    const card = this.randomCard();
    this.cardRef.current.setCard(card.source, card.target);
  }

  render() {
    const randomCard = this.randomCardFromBox(this.randomNonEmptyBox());

    return (
      <div>
        {this.boxes.map((box, i) =>
          <Box key={i} ref={this.boxRefs[i]} numberOfCards={box.cards.length} />
        )}
        <Card ref={this.cardRef} source={randomCard.source} target={randomCard.target} />
        <button onClick={() => this.addCard("hello", "world")}>Add Card</button>
        <button onClick={() => this.showRandomCard()}>Refresh Card</button>
      </div>
    );
  }
}

// <div style={{border: "1px solid black"}}>
//   {this.randomNonEmptyBox().randomCard().view()}
// </div>
// <button onClick={() => this.add("hello", "world")}>Add Card</button>

export default App;
