import { nanoid } from 'nanoid';

const generateSessionToken = () => {
  return nanoid();
};

/**
 * Encodes a value with base64 .
 * @param value - The plain value to encode.
 * @returns The hashed password.
 */
const encodeBase64 = (value: string): string => {
  const base64Encoded = Buffer.from(value).toString('base64');
  return base64Encoded;
};

/**
 * Decodes a value from base64 .
 * @param encodedValue - The encoded value to decode.
 * @returns The hashed password.
 */
const decodeBase64 = (encodedValue: string): string => {
  const decodedValue = Buffer.from(encodedValue, 'base64').toString('utf-8');
  return decodedValue;
};

export { decodeBase64, encodeBase64, generateSessionToken };
