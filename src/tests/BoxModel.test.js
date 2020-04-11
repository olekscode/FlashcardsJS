import BoxModel from "../models/BoxModel";

let bonjourCard, bonsoirCard, auRevoirCard, otherBonjourCard;
let cards, probability, box;

beforeEach(() => {
  bonjourCard = {
    source: "bonjour",
    target: "hello"
  };

  bonsoirCard = {
    source: "bonsoir",
    target: "good evening"
  };

  auRevoirCard = {
    source: "au revoir",
    target: "goodbye"
  };

  otherBonjourCard = {
    source: "bonjour",
    target: "good morning"
  };

  cards = [bonjourCard, bonsoirCard];
  probability = 0.75;
  box = new BoxModel(cards, probability);
});

test("can access number of cards", () => {
  expect(box.numberOfCards).toEqual(2);
});

test("can add a new card", () => {
  box.addCard(auRevoirCard);
  expect(box.numberOfCards).toEqual(3);
});

test("includes a card", () => {
  expect(box.includesCard(bonsoirCard)).toBeTruthy();
});

test("does not include a card", () => {
  expect(box.includesCard(auRevoirCard)).toBeFalsy();
});

test("does not include a card if only source matches", () => {
  expect(box.includesCard(otherBonjourCard)).toBeFalsy();
});

test("includes a card with given source", () => {
  expect(box.includesCardWithSource(otherBonjourCard.source)).toBeTruthy();
});
