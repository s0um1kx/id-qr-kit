import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrOptions } from '../core/types';

export function useQR(options: QrOptions) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const {
    value,
    size = 200,
    margin = 2,
    errorCorrection = 'M',
    color = { dark: '#000000', light: '#ffffff' },
  } = options;

  useEffect(() => {
    if (!value) {
      setDataUrl('');
      setSvgString('');
      return;
    }

    let isMounted = true;

    const generateQR = async () => {
      try {
        const qrOpts = {
          width: size,
          margin,
          errorCorrectionLevel: errorCorrection,
          color: {
            dark: color.dark || '#000000',
            light: color.light || '#ffffff',
          },
        };

        const [url, svg] = await Promise.all([
          QRCode.toDataURL(value, qrOpts),
          QRCode.toString(value, { ...qrOpts, type: 'svg' }),
        ]);

        if (isMounted) {
          setDataUrl(url);
          setSvgString(svg);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      }
    };

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [value, size, margin, errorCorrection, color.dark, color.light]);

  const downloadPNG = useCallback(
    (fileName = 'qrcode.png') => {
      if (!dataUrl) return;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    },
    [dataUrl]
  );

  return { dataUrl, svgString, error, downloadPNG };
}