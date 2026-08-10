import React from 'react';
import { QuickQR } from '../components/QuickQR';

export interface EventBadgeProps {
  id: string;
  name: string;
  role?: string;
  eventName?: string;
  qrValue?: string;
  className?: string;
}

export const EventBadge: React.FC<EventBadgeProps> = ({
  id,
  name,
  role = 'Attendee',
  eventName = 'HACKATHON 2026',
  qrValue,
  className = '',
}) => {
  const actualQrValue = qrValue || id;

  return (
    <div
      className={`w-80 bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm flex flex-col items-center ${className}`}
    >
      {/* Header Banner */}
      <div className="w-full bg-[#111111] text-white py-3 px-4 text-center">
        <span className="text-[11px] font-medium tracking-[0.08em] uppercase block text-[#A3A3A3]">
          {eventName}
        </span>
      </div>

      {/* Badge Content */}
      <div className="p-6 flex flex-col items-center w-full text-center">
        {/* Person Info */}
        <h3 className="text-lg font-semibold text-[#111111] tracking-tight">{name}</h3>
        <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-[#F5F5F5] text-[#111111] border border-[#E7E5E4] rounded-full">
          {role}
        </span>

        {/* QR Code Container */}
        <div className="my-5">
          <QuickQR
            value={actualQrValue}
            size={140}
            downloadable={false}
            copyable={false}
            className="border-none p-0"
          />
        </div>

        {/* Unique ID Display */}
        <div className="w-full pt-3 border-t border-[#F5F5F5] flex items-center justify-between text-left">
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#A3A3A3]">
            ID PASS
          </span>
          <code className="text-xs font-mono font-medium text-[#111111] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#E7E5E4]">
            {id}
          </code>
        </div>
      </div>
    </div>
  );
};