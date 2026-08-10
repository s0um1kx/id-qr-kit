export type CharsetType = 'hex' | 'numeric' | 'alpha' | 'alphanumeric';

export interface IdOptions {
  prefix?: string;
  length?: number;
  charset?: CharsetType | string;
  generator?: () => string;
}

export interface HexOptions {
  length?: number;
  withHash?: boolean;
  isColor?: boolean;
}

export interface QrOptions {
  value: string;
  size?: number;
  margin?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

export interface BarcodeOptions {
  value: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF' | 'MSI';
  height?: number;
  width?: number;
  displayValue?: boolean;
  color?: {
    line?: string;
    background?: string;
  };
  margin?: number;
}