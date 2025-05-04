export const shuffleArray = (array) => {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array');
  }

  const shuffled = [...array]; // create a copy to not mutate the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// allows for large arrays to be shuffled but might not need to be as we won't be allowing a massive amount of images to be used per question