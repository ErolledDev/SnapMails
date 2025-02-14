// Common words for generating readable email addresses
export const adjectives = [
  'happy', 'clever', 'brave', 'bright', 'calm', 'eager', 'fair', 'kind',
  'proud', 'quick', 'smart', 'swift', 'warm', 'wise', 'bold', 'cool',
  'free', 'good', 'nice', 'safe', 'sharp', 'fresh', 'light', 'clear',
  'crisp', 'pure', 'prime', 'keen', 'fast', 'agile'
];

export const nouns = [
  'tiger', 'eagle', 'wolf', 'bear', 'lion', 'hawk', 'deer', 'fox',
  'owl', 'seal', 'swan', 'dove', 'fish', 'duck', 'bird', 'cat',
  'dog', 'bee', 'ant', 'elk', 'puma', 'lynx', 'kite', 'lark',
  'hare', 'fawn', 'dove', 'wren', 'teal', 'swift'
];

const generateRandomNumber = (min: number, max: number): number => {
  const range = max - min + 1;
  const bytes = new Uint32Array(1);
  window.crypto.getRandomValues(bytes);
  return min + (bytes[0] % range);
};

export const generateEmailUser = (): string => {
  const adjective = adjectives[generateRandomNumber(0, adjectives.length - 1)];
  const noun = nouns[generateRandomNumber(0, nouns.length - 1)];
  const number = generateRandomNumber(100, 999);
  return `${adjective}${noun}${number}`;
};