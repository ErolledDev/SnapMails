// Common words for generating readable email addresses
export const adjectives = [
  'happy', 'clever', 'brave', 'bright', 'calm', 'eager', 'fair', 'kind',
  'proud', 'quick', 'smart', 'swift', 'warm', 'wise', 'bold', 'cool',
  'free', 'good', 'nice', 'safe'
];

export const nouns = [
  'tiger', 'eagle', 'wolf', 'bear', 'lion', 'hawk', 'deer', 'fox',
  'owl', 'seal', 'swan', 'dove', 'fish', 'duck', 'bird', 'cat',
  'dog', 'bee', 'ant', 'elk'
];

export const generateEmailUser = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${number}`;
};