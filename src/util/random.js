export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
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
