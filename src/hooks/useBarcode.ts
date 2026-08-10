import { useEffect, useRef, useState, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import { BarcodeOptions } from '../core/types';

export function useBarcode(options: BarcodeOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const {
    value,
    format = 'CODE128',
    height = 80,
    width = 2,
    displayValue = true,
    color = { line: '#000000', background: '#ffffff' },
    margin = 10,
  } = options;

  useEffect(() => {
    if (!value || !canvasRef.current) {
      setDataUrl('');
      return;
    }

    try {
      JsBarcode(canvasRef.current, value, {
        format,
        height,
        width,
        displayValue,
        lineColor: color.line || '#000000',
        background: color.background || '#ffffff',
        margin,
        valid: (valid) => {
          if (!valid) {
            setError(new Error(`Invalid value "${value}" for barcode format ${format}`));
          } else {
            setError(null);
          }
        },
      });

      setDataUrl(canvasRef.current.toDataURL('image/png'));
    } catch (err) {
      setError(err as Error);
    }
  }, [value, format, height, width, displayValue, color.line, color.background, margin]);

  const downloadPNG = useCallback(
    (fileName = 'barcode.png') => {
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    },
    [dataUrl]
  );

  return { canvasRef, dataUrl, error, downloadPNG };
}