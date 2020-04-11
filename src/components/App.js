import React from 'react';

import boxes from "../data/boxes.json";

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class Card extends React.Component {
  render() {
    return (
      <div>{this.props.source} - {this.props.target}</div>
    );
  }
}

class Box extends React.Component {
  render() {
    return (
      <div>Box: {this.props.numberOfCards}</div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: boxes,
      card: {source: undefined, target: undefined}
    };
  }

  componentDidMount() {
    this.showRandomCard();
  }

  randomNonEmptyBox() {
    const nonEmptyBoxes = this.state.boxes.filter(box => box.cards.length);
    return randomChoice(nonEmptyBoxes);
  }

  randomCardFromBox(box) {
    return randomChoice(box.cards);
  }

  randomCard() {
    const box = this.randomNonEmptyBox();
    return this.randomCardFromBox(box);
  }

  addCard(source, target) {
    this.setState(state => {
      state.boxes[0].cards.push({
        source: source,
        target: target
      });

      return {boxes: state.boxes};
    });
  }

  showRandomCard() {
    this.setState({card: this.randomCard()});
  }

  render() {
    return (
      <div>
        {this.state.boxes.map((box, i) =>
          <Box key={i} numberOfCards={box.cards.length} />
        )}
        <Card source={this.state.card.source} target={this.state.card.target} />
        <button onClick={() => this.addCard("hello", "world")}>Add Card</button>
        <button onClick={() => this.showRandomCard()}>Refresh Card</button>
      </div>
    );
  }
}

export default App;
