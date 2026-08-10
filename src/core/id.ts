import { IdOptions } from './types';

const CHARSETS = {
  hex: '0123456789abcdef',
  numeric: '0123456789',
  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

export function createId(options: IdOptions = {}): string {
  const { prefix = '', length = 8, charset = 'alphanumeric', generator } = options;

  // Custom user-defined generator function take precedence
  if (generator) {
    const customResult = generator();
    return prefix ? `${prefix}-${customResult}` : customResult;
  }

  // Resolve charset characters
  const charPool = CHARSETS[charset as keyof typeof CHARSETS] || charset;

  if (!charPool || charPool.length === 0) {
    throw new Error('[id-qr-kit] Invalid or empty charset provided');
  }

  // Secure random character selection using Web Crypto API
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let generatedId = '';
  for (let i = 0; i < length; i++) {
    generatedId += charPool[randomBytes[i] % charPool.length];
  }

  return prefix ? `${prefix}-${generatedId}` : generatedId;
}