import { HexOptions } from './types';

export function createHex(options: HexOptions = {}): string {
  const { length = 6, withHash = false, isColor = false } = options;

  const hexChars = '0123456789ABCDEF';
  const targetLength = isColor ? 6 : length;

  const randomBytes = new Uint8Array(targetLength);
  crypto.getRandomValues(randomBytes);

  let hexResult = '';
  for (let i = 0; i < targetLength; i++) {
    hexResult += hexChars[randomBytes[i] % 16];
  }

  const prefix = withHash || isColor ? '#' : '';
  return `${prefix}${hexResult}`;
}