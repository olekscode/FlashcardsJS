import {randomChoice} from "../util/random";

class BoxModel {
  constructor(cards, probability) {
    this.cards = cards;
    this.probability = probability;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  isEmpty() {
    return this.numberOfCards === 0;
  }

  includesCard(card) {
    return this.cards.some(_card =>
      _card.source === card.source && _card.target === card.target
    );
  }

  includesCardWithSource(source) {
    return this.cards.some(card =>
      card.source === source
    );
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
  }

  chooseRandomCard() {
    return randomChoice(this.cards);
  }
}

export default BoxModel;
