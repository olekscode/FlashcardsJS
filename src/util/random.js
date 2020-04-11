export function randomInteger(from, to) {
  return Math.floor(Math.random() * (to - from)) + from;
}

export function randomChoice(array) {
  return array[randomInteger(0, array.length)];
}

export function weightedRandomChoice(array, weights) {
  let sum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(weight => weight / sum);

  sum = 0;

  const cumulativeWeights = normalizedWeights.map(weight =>
    sum = sum + weight
  );

  const randomNumber = Math.random();
  const index = cumulativeWeights.findIndex(weight => weight >= randomNumber);

  return array[index];
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInteger(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
