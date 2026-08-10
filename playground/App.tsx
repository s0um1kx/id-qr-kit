import { useState, useRef, useEffect } from 'react';
import { createId } from '../src/core/id';
import { QuickQR } from '../src/components/QuickQR';
import { QuickBarcode } from '../src/components/QuickBarcode';
import { EventBadge } from '../src/templates/EventBadge';
import { EventTicket } from '../src/templates/EventTicket';
import { Copy, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// Custom Aesthetic Dropdown Component
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

// Official Solid GitHub Octocat Icon
function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
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

  // QR state
  const [qrSize, setQrSize] = useState(200);
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Barcode state
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'CODE39' | 'EAN13'>('CODE128');

  // Regenerate ID
  const handleRegenerate = () => {
    setGeneratedId(createId({ prefix, length, charset }));
  };

  // Generate code snippet text based on active tab
  const getCodeSnippet = () => {
    switch (activeTab) {
      case 'id':
        return `import { createId } from 'id-qr-kit';\n\nconst id = createId({ prefix: '${prefix}', length: ${length}, charset: '${charset}' });`;
      case 'qr':
        return `import { QuickQR } from 'id-qr-kit';\n\n<QuickQR value="${generatedId}" size={${qrSize}} errorCorrection="${ecc}" downloadable copyable />`;
      case 'barcode':
        return `import { QuickBarcode } from 'id-qr-kit';\n\n<QuickBarcode value="${generatedId}" format="${barcodeFormat}" downloadable copyable />`;
      case 'badge':
        return `import { EventBadge } from 'id-qr-kit';\n\n<EventBadge id="${generatedId}" name="Alex Turner" role="Hacker" />`;
      case 'ticket':
        return `import { EventTicket } from 'id-qr-kit';\n\n<EventTicket id="${generatedId}" attendeeName="Alex Turner" tier="VIP PASS" />`;
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* Header */}
      <header className="border-b border-[#E7E5E4] px-6 py-4 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-2">
          <h1 className="font-mono text-xl font-bold tracking-wider text-black uppercase">
            ID-QR-KIT
          </h1>
        </div>
        
        {/* Premium GitHub Button Card */}
        <a
          href="https://github.com/s0um1kx/id-qr-kit"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-[#111111] bg-white border border-[#E0E0E0] rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 hover:bg-[#F8F8F8] transition-all shadow-xs"
        >
          <GitHubIcon className="w-4 h-4 text-[#111111]" />
          <span className="font-medium">GitHub</span>
        </a>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Controls (320px) */}
        <aside className="w-80 border-r border-[#E7E5E4] flex flex-col bg-white z-10">
          {/* Navigation Tabs Header */}
          <nav className="flex items-center border-b border-[#E7E5E4]">
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

          {/* Config Controls Options */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono">
            {/* ID Options */}
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

            {/* Tab Specific Options */}
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

        {/* Right Preview & Code Section */}
        <main className="flex-1 flex flex-col bg-[#FAFAFA]">
          {/* Top Barcode / Element Preview Stage with Dot Pattern Background */}
          <div
            className="flex-1 flex items-center justify-center p-8 overflow-auto relative"
            style={{
              backgroundColor: '#FAFAFA',
              backgroundImage: 'radial-gradient(#D4D4D4 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
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
              <EventBadge id={generatedId} name="Alex Turner" role="Hacker Pass" />
            )}

            {activeTab === 'ticket' && (
              <EventTicket id={generatedId} attendeeName="Alex Turner" tier="VIP PASS" />
            )}
          </div>

          {/* Bottom Code Block */}
          <div className="border-t border-[#E7E5E4] bg-[#111111] text-white p-4 font-mono z-10">
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
            <pre className="font-mono text-xs text-[#E7E5E4] overflow-x-auto p-2 bg-[#0A0A0A] rounded border border-[#262626]">
              {getCodeSnippet()}
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}