import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

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
      boxSizes: this.boxes.map(box => box.numberOfCards)
    };
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
    console.log(`Moving card "${card.source}-${card.target}" from box ${fromBoxNumber} to box ${toBoxNumber}`);
    this.boxes[fromBoxNumber].removeCard(card);
    this.boxes[toBoxNumber].addCard(card);

    this.updateBoxSizes();
  }

  moveCardForward(card) {
    const currentBoxNumber = this.boxes.findIndex(box => box.includesCard(card));

    if (currentBoxNumber === this.boxes.length - 1)
      return;

    const nextBoxNumber = currentBoxNumber + 1;
    console.log(`Card "${card.source}-${card.target}" is in box ${currentBoxNumber}`);
    this.moveCard(card, currentBoxNumber, nextBoxNumber);
  }

  moveCardBackward(card) {
    const currentBoxNumber = this.boxes.findIndex(box => box.includesCard(card));

    if (currentBoxNumber === 0)
      return;

    this.moveCard(card, currentBoxNumber, 0);
  }

  handleExerciseResult(cards) {
    console.log(this.boxes);
    cards.passed.forEach(card => this.moveCardForward(card));
    cards.failed.forEach(card => this.moveCardBackward(card));
    console.log(this.boxes);
  }

  render() {
    console.log("Rendering App");
    return (
      <Router>
        <Switch>
          <Route path="/add">
            <AddCardForm
              onSubmit={(card) => this.addCard(card)} />
          </Route>
          <Route path="/match">
            <MatchCardsExercise
              cards={this.chooseRandomCardsWithoutRepetition(10)}
              onSubmit={(cards) => this.handleExerciseResult(cards)} />
          </Route>
          <Route path="/">
            <div>
              {this.state.boxSizes.map((boxSize, i) =>
                <Box key={i} numberOfCards={boxSize} />
              )}
            </div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/add">Add Card</Link>
                </li>
                <li>
                  <a href="match">Match Cards Exercise</a>
                </li>
              </ul>
            </nav>
          </Route>
        </Switch>
      </Router>
    );
  }
}

// <SelectDefinitionExercise
//   sourceCard={this.chooseRandomCard()}
//   falseTargets={this.chooseRandomCards(4).map(card => card.target)} />

export default FlipcardsApp;
