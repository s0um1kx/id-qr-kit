import React, { useState } from 'react';
import { useBarcode } from '../hooks/useBarcode';
import { BarcodeOptions } from '../core/types';
import { Download, Copy, Check } from 'lucide-react';

export interface QuickBarcodeProps extends BarcodeOptions {
  downloadable?: boolean;
  copyable?: boolean;
  className?: string;
}

export const QuickBarcode: React.FC<QuickBarcodeProps> = ({
  value,
  format = 'CODE128',
  height = 80,
  width = 2,
  displayValue = true,
  color,
  margin = 10,
  downloadable = true,
  copyable = true,
  className = '',
}) => {
  const { canvasRef, error, downloadPNG } = useBarcode({
    value,
    format,
    height,
    width,
    displayValue,
    color,
    margin,
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="text-xs text-red-600 border border-red-200 bg-red-50 p-2 rounded">
        {error.message}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center gap-2 p-3 bg-white border border-[#E7E5E4] rounded-lg ${className}`}>
      <canvas ref={canvasRef} className="max-w-full" />

      {(downloadable || copyable) && (
        <div className="flex items-center gap-1.5 w-full justify-center pt-1 border-t border-[#F5F5F5]">
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F5F5F5] rounded transition-colors"
              title="Copy value"
              type="button"
            >
              {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.75} />}
            </button>
          )}
          {downloadable && (
            <button
              onClick={() => downloadPNG(`barcode-${value || 'code'}.png`)}
              className="p-1.5 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F5F5F5] rounded transition-colors"
              title="Download PNG"
              type="button"
            >
              <Download size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};