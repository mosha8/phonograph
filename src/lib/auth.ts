import { nanoid } from 'nanoid';

const generateSessionToken = () => {
  return nanoid();
};

export { generateSessionToken };
