import React from "react";
import Box from "./Box";
import AddCardForm from "./AddCardForm";
import BoxModel from "../models/BoxModel";
import {weightedRandomChoice} from "../util/random";


class FlipcardsApp extends React.Component {
  constructor(props) {
    super(props);
    this.boxes = props.boxes.map(box =>
      new BoxModel(box.cards, parseFloat(box.probability)));

    this.state = {
      boxSizes: this.boxes.map(() => 0)
    };
  }

  componentDidMount() {
    this.updateBoxSizes();
  }

  updateBoxSizes() {
    this.setState({
      boxSizes: this.boxes.map(box => box.numberOfCards)
    });
  }

  randomNonEmptyBox() {
    const nonEmptyBoxes = this.boxes.filter(box => !box.isEmpty());
    const probabilities = nonEmptyBoxes.map(box => box.probability);
    return weightedRandomChoice(nonEmptyBoxes, probabilities);
  }

  randomCard() {
    const box = this.randomNonEmptyBox();
    return box.chooseRandomCard();
  }

  validateNewCard(card) {
    if (this.boxes.some(box => box.includesCardWithSource(card.source))) {
      throw `A card with source "${card.source}" already exists`;
    }
  }

  addCard(card) {
    this.validateNewCard(card);

    this.boxes[0].addCard({
      source: card.source,
      target: card.target
    });

    this.updateBoxSizes();
  }

  moveCard(card, fromBoxNumber, toBoxNumber) {
    this.boxes[fromBoxNumber].removeCard(card);
    this.boxes[toBoxNumber].addCard(card);

    this.updateBoxSizes();
  }

  moveCardForward(card) {
    const currentBoxNumber = this.boxes.findIndex(box => box.includesCard(card));

    if (currentBoxNumber === this.boxes.length - 1)
      return;

    const nextBoxNumber = currentBoxNumber + 1;
    this.moveCard(card, currentBoxNumber, nextBoxNumber);
  }

  moveCardBackward(card) {
    const currentBoxNumber = this.boxes.findIndex(box => box.includesCard(card));

    if (currentBoxNumber === 0)
      return;

    this.moveCard(card, currentBoxNumber, 0);
  }

  handleExerciseResult(cards) {
    cards.passed.forEach(card => this.moveCardForward(card));
    cards.failed.forEach(card => this.moveCardBackward(card));
  }

  render() {
    return (
      <div>
        {this.state.boxSizes.map((boxSize, i) =>
          <Box key={i} numberOfCards={boxSize} />
        )}
        <AddCardForm onSubmit={(card) => this.addCard(card)} />
      </div>
    );
  }
}

export default FlipcardsApp;
