import React, { useState } from 'react';
import { useQR } from '../hooks/useQR';
import { QrOptions } from '../core/types';
import { Download, Copy, Check } from 'lucide-react';

export interface QuickQRProps extends QrOptions {
  downloadable?: boolean;
  copyable?: boolean;
  className?: string;
}

export const QuickQR: React.FC<QuickQRProps> = ({
  value,
  size = 200,
  margin = 2,
  errorCorrection = 'M',
  color,
  downloadable = true,
  copyable = true,
  className = '',
}) => {
  const { dataUrl, error, downloadPNG } = useQR({
    value,
    size,
    margin,
    errorCorrection,
    color,
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
      {dataUrl ? (
        <img src={dataUrl} alt={`QR code for ${value}`} width={size} height={size} className="block" />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-[#F5F5F5] flex items-center justify-center text-xs text-[#A3A3A3]"
        >
          No Value
        </div>
      )}

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
              onClick={() => downloadPNG(`qr-${value || 'code'}.png`)}
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