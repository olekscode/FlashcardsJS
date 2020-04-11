import React from "react";
import Box from "./Box";
import BoxModel from "../models/BoxModel";
import AddCardForm from "./AddCardForm";
import SelectDefinitionExercise from "./SelectDefinitionExercise";
import MatchCardsExercise from "./MatchCardsExercise";
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

  chooseRandomNonEmptyBox() {
    const nonEmptyBoxes = this.boxes.filter(box => !box.isEmpty());
    const probabilities = nonEmptyBoxes.map(box => box.probability);
    return weightedRandomChoice(nonEmptyBoxes, probabilities);
  }

  chooseRandomCard() {
    const box = this.chooseRandomNonEmptyBox();
    return box.chooseRandomCard();
  }

  chooseRandomCardsWithoutRepetition(numberOfCards) {
    const weightedCards = this.boxes.map(box =>
      box.cards.map(card => ({
        card: card,
        weight: box.probability
      }))).flat();

    const uniqueWeightedCards = weightedCards.reduce((unique, item) =>
      unique.some(_item => _item.card.source === item.card.source)
      ? unique
      : [...unique, item], []);

    const uniqueCards = uniqueWeightedCards.map(item => item.card);
    const weights = uniqueWeightedCards.map(item => item.weight);

    if (uniqueCards.length <= numberOfCards)
      return uniqueCards;

    let randomCard, randomCardIndex;
    const randomCards = [];

    for (let i = 0; i < numberOfCards; ++i) {
      randomCard = weightedRandomChoice(uniqueCards, weights);
      randomCards.push(randomCard);

      // Remove the card that was selected
      randomCardIndex = uniqueCards.indexOf(randomCard);
      uniqueCards.splice(randomCardIndex, 1);
      weights.splice(randomCardIndex, 1);
    }
    return randomCards;
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

        <AddCardForm
          onSubmit={(card) => this.addCard(card)} />

        <MatchCardsExercise
          cards={this.chooseRandomCardsWithoutRepetition(10)}
          onSubmit={(cards) => this.handleExerciseResult(cards)} />
      </div>
    );
  }
}

// <SelectDefinitionExercise
//   sourceCard={this.chooseRandomCard()}
//   falseTargets={this.chooseRandomCards(4).map(card => card.target)} />

export default FlipcardsApp;
