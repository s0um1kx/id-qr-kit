import { useState, useRef, useEffect } from 'react';
import { createId } from '../src/core/id';
import { QuickQR } from '../src/components/QuickQR';
import { QuickBarcode } from '../src/components/QuickBarcode';
import { EventBadge } from '../src/templates/EventBadge';
import { EventTicket } from '../src/templates/EventTicket';
import { Copy, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface CustomSelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (val: T) => void;
  width?: string;
}

function CustomSelect<T extends string>({ value, options, onChange, width = "w-32" }: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 px-2.5 bg-white border border-[#111111] rounded-md text-xs font-mono text-[#111111] flex items-center justify-between shadow-xs transition-all focus:outline-none"
      >
        <span className="truncate">{selectedLabel}</span>
        {isOpen ? (
          <ChevronUp size={12} className="text-[#6B6B6B] shrink-0 ml-1" />
        ) : (
          <ChevronDown size={12} className="text-[#6B6B6B] shrink-0 ml-1" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-[#E7E5E4] rounded-lg shadow-lg overflow-hidden py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-[#F5F5F5] text-[#111111] font-medium'
                    : 'text-[#A3A3A3] hover:text-[#111111] hover:bg-[#FAFAFA]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LineArtGitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'id' | 'qr' | 'barcode' | 'badge' | 'ticket'>('id');
  const [copied, setCopied] = useState(false);

  // Controls state
  const [prefix, setPrefix] = useState('ORD');
  const [length, setLength] = useState(8);
  const [charset, setCharset] = useState<'hex' | 'numeric' | 'alpha' | 'alphanumeric'>('alphanumeric');
  const [generatedId, setGeneratedId] = useState(() => createId({ prefix: 'ORD', length: 8 }));

  // Customization State
  const [eventName, setEventName] = useState('TECH CONFERENCE 2026');
  const [attendeeName, setAttendeeName] = useState('Alex Turner');
  const [role, setRole] = useState('VIP PASS');
  const [ticketDate, setTicketDate] = useState('OCT 12, 2026');
  const [ticketTime, setTicketTime] = useState('09:00 AM');
  const [ticketGate, setTicketGate] = useState('G3');
  const [ticketSeat, setTicketSeat] = useState('A-12');

  // QR state
  const [qrSize, setQrSize] = useState(200);
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Barcode state
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'CODE39' | 'EAN13'>('CODE128');

  const handleRegenerate = () => {
    setGeneratedId(createId({ prefix, length, charset }));
  };

  const getCodeSnippet = () => {
    switch (activeTab) {
      case 'id':
        return `import { createId } from 'id-qr-kit';\n\nconst id = createId({ prefix: '${prefix}', length: ${length}, charset: '${charset}' });`;
      case 'qr':
        return `import { QuickQR } from 'id-qr-kit';\n\n<QuickQR value="${generatedId}" size={${qrSize}} errorCorrection="${ecc}" downloadable copyable />`;
      case 'barcode':
        return `import { QuickBarcode } from 'id-qr-kit';\n\n<QuickBarcode value="${generatedId}" format="${barcodeFormat}" downloadable copyable />`;
      case 'badge':
        return `import { EventBadge } from 'id-qr-kit';\n\n<EventBadge id="${generatedId}" name="${attendeeName}" role="${role}" eventName="${eventName}" />`;
      case 'ticket':
        return `import { EventTicket } from 'id-qr-kit';\n\n<EventTicket\n  id="${generatedId}"\n  eventName="${eventName}"\n  attendeeName="${attendeeName}"\n  tier="${role}"\n  date="${ticketDate}"\n  time="${ticketTime}"\n  gate="${ticketGate}"\n  seat="${ticketSeat}"\n/>`;
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-white text-[#111111] overflow-hidden">
      <header className="border-b border-[#E7E5E4] px-6 py-4 flex items-center justify-between bg-white z-10 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="font-mono text-xl font-bold tracking-wider text-black uppercase">
            ID-QR-KIT
          </h1>
        </div>
        
        <a
          href="https://github.com/s0um1kx/id-qr-kit"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-[#D1D5DB] rounded-lg px-3.5 py-1.5 flex items-center gap-2.5 hover:bg-[#F9FAFB] transition-all shadow-xs group"
        >
          <LineArtGitHubIcon className="w-4 h-4 text-[#111827] group-hover:scale-105 transition-transform" />
          <span className="font-sans font-medium text-xs text-[#111827] tracking-tight">GitHub</span>
        </a>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Controls */}
        <aside className="w-80 border-r border-[#E7E5E4] flex flex-col bg-white z-10 shrink-0">
          <nav className="flex items-center border-b border-[#E7E5E4] shrink-0">
            {(['id', 'qr', 'barcode', 'badge', 'ticket'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 h-11 font-mono text-xs font-bold tracking-widest uppercase transition-colors relative ${
                    isActive
                      ? 'bg-gray-100 text-black border-b-2 border-black'
                      : 'text-gray-400 hover:text-gray-700 bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>

          <div
            className="p-4 flex-1 overflow-y-auto space-y-4 font-mono"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(161, 161, 170, 0.4) transparent' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                <label className="text-xs font-medium text-[#6B6B6B]">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-32 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                />
              </div>

              <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                <label className="text-xs font-medium text-[#6B6B6B]">Length ({length})</label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-32 accent-[#111111]"
                />
              </div>

              <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                <label className="text-xs font-medium text-[#6B6B6B]">Charset</label>
                <CustomSelect<'alphanumeric' | 'alpha' | 'numeric' | 'hex'>
                  value={charset}
                  onChange={setCharset}
                  width="w-32"
                  options={[
                    { value: 'alphanumeric', label: 'Alphanumeric' },
                    { value: 'alpha', label: 'Alpha' },
                    { value: 'numeric', label: 'Numeric' },
                    { value: 'hex', label: 'Hex' },
                  ]}
                />
              </div>

              <button
                onClick={handleRegenerate}
                className="w-full h-10 mt-2 bg-[#111111] hover:bg-[#262626] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors font-mono shadow-sm"
              >
                <RefreshCw size={14} strokeWidth={2} />
                <span>Regenerate ID</span>
              </button>
            </div>

            {(activeTab === 'badge' || activeTab === 'ticket') && (
              <div className="pt-2 border-t border-[#E7E5E4] space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3A3A3]">
                  Template Details
                </span>
                
                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Event Title</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                  />
                </div>

                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Attendee Name</label>
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                  />
                </div>

                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Role / Tier</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                  />
                </div>

                {activeTab === 'ticket' && (
                  <>
                    <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                      <label className="text-xs font-medium text-[#6B6B6B]">Date</label>
                      <input
                        type="text"
                        value={ticketDate}
                        onChange={(e) => setTicketDate(e.target.value)}
                        className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                      <label className="text-xs font-medium text-[#6B6B6B]">Time</label>
                      <input
                        type="text"
                        value={ticketTime}
                        onChange={(e) => setTicketTime(e.target.value)}
                        className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                      <label className="text-xs font-medium text-[#6B6B6B]">Gate</label>
                      <input
                        type="text"
                        value={ticketGate}
                        onChange={(e) => setTicketGate(e.target.value)}
                        className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                      <label className="text-xs font-medium text-[#6B6B6B]">Seat</label>
                      <input
                        type="text"
                        value={ticketSeat}
                        onChange={(e) => setTicketSeat(e.target.value)}
                        className="w-36 h-8 px-2 border border-[#E7E5E4] rounded-md text-xs focus:outline-none focus:border-[#111111] font-mono"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="pt-2 border-t border-[#E7E5E4] space-y-3">
                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Size ({qrSize}px)</label>
                  <input
                    type="range"
                    min="128"
                    max="300"
                    step="10"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-32 accent-[#111111]"
                  />
                </div>

                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">ECC Level</label>
                  <CustomSelect<'L' | 'M' | 'Q' | 'H'>
                    value={ecc}
                    onChange={setEcc}
                    width="w-36"
                    options={[
                      { value: 'L', label: 'L (Low 7%)' },
                      { value: 'M', label: 'M (Medium 15%)' },
                      { value: 'Q', label: 'Q (Quartile 25%)' },
                      { value: 'H', label: 'H (High 30%)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {activeTab === 'barcode' && (
              <div className="pt-2 border-t border-[#E7E5E4] space-y-3">
                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Format</label>
                  <CustomSelect<'CODE128' | 'CODE39' | 'EAN13'>
                    value={barcodeFormat}
                    onChange={setBarcodeFormat}
                    width="w-32"
                    options={[
                      { value: 'CODE128', label: 'CODE128' },
                      { value: 'CODE39', label: 'CODE39' },
                      { value: 'EAN13', label: 'EAN13' },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Preview Stage */}
        <main className="flex-1 flex flex-col bg-[#FAFAFA] overflow-hidden min-w-0">
          {/* Scrollable Canvas Section */}
          <div
            className="flex-1 overflow-y-auto p-8 flex items-center justify-center relative"
            style={{
              backgroundColor: '#FAFAFA',
              backgroundImage: 'radial-gradient(#D4D4D4 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(161, 161, 170, 0.4) transparent',
            }}
          >
            {activeTab === 'id' && (
              <div className="flex flex-col items-center gap-2 p-6 border border-[#E7E5E4] rounded-lg bg-white shadow-xs">
                <span className="text-xs font-mono font-medium text-[#A3A3A3] uppercase tracking-wider">
                  Generated Unique ID
                </span>
                <code className="text-2xl font-mono font-bold text-[#111111]">{generatedId}</code>
              </div>
            )}

            {activeTab === 'qr' && (
              <QuickQR value={generatedId} size={qrSize} errorCorrection={ecc} />
            )}

            {activeTab === 'barcode' && (
              <QuickBarcode value={generatedId} format={barcodeFormat} />
            )}

            {activeTab === 'badge' && (
              <EventBadge id={generatedId} name={attendeeName} role={role} eventName={eventName} />
            )}

            {activeTab === 'ticket' && (
              <EventTicket
                id={generatedId}
                eventName={eventName}
                attendeeName={attendeeName}
                tier={role}
                date={ticketDate}
                time={ticketTime}
                gate={ticketGate}
                seat={ticketSeat}
              />
            )}
          </div>

          {/* Fixed Bottom Code Block with Uniform Height */}
          <div className="border-t border-[#E7E5E4] bg-[#111111] text-white p-4 font-mono z-10 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A3A3A3]">
                React Code Snippet
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#262626] hover:bg-[#333333] border border-[#404040] rounded-md transition-colors font-mono font-bold uppercase tracking-wider text-white"
              >
                {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre
              className="h-28 font-mono text-xs text-[#E7E5E4] overflow-y-auto overflow-x-auto p-3 bg-[#0A0A0A] rounded border border-[#262626] leading-relaxed"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
              }}
            >
              {getCodeSnippet()}
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}