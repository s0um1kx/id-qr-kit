import { QuickQR } from '../components/QuickQR';

export interface EventTicketProps {
  id: string;
  eventName?: string;
  date?: string;
  time?: string;
  seat?: string;
  gate?: string;
  attendeeName?: string;
  tier?: string;
}

export function EventTicket({
  id,
  eventName = "TECH CONFERENCE 2026",
  date = "OCT 12, 2026",
  time = "09:00 AM",
  seat = "A-12",
  gate = "G3",
  attendeeName = "Alex Turner",
  tier = "VIP PASS",
}: EventTicketProps) {
  return (
    <div className="w-full max-w-lg bg-white border border-[#E7E5E4] rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden relative font-sans">
      {/* Main Ticket Section */}
      <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-[#D4D4D4]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest bg-[#F5F5F5] text-[#525252] px-2 py-1 rounded">
              {tier}
            </span>
            <span className="text-xs text-[#A3A3A3] font-mono">{date}</span>
          </div>
          <h3 className="text-lg font-bold text-[#111111] leading-tight mb-1">
            {eventName}
          </h3>
          <p className="text-xs text-[#737373]">{attendeeName}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-[#F5F5F5] text-left">
          <div>
            <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-mono">TIME</p>
            <p className="text-xs font-semibold text-[#111111]">{time}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-mono">GATE</p>
            <p className="text-xs font-semibold text-[#111111]">{gate}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-mono">SEAT</p>
            <p className="text-xs font-semibold text-[#111111]">{seat}</p>
          </div>
        </div>
      </div>

      {/* Ticket Stub / QR Section - Updated min-w-40 here */}
      <div className="p-6 bg-[#FAFAFA] flex flex-col items-center justify-center min-w-40">
        <QuickQR value={id} size={110} />
        <span className="text-[10px] font-mono text-[#A3A3A3] mt-2 tracking-wider">
          {id}
        </span>
      </div>
    </div>
  );
}