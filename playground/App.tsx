import React, { useState } from 'react';
import { createId } from '../src/core/id';
import { QuickQR } from '../src/components/QuickQR';
import { QuickBarcode } from '../src/components/QuickBarcode';
import { EventBadge } from '../src/templates/EventBadge';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'id' | 'qr' | 'barcode' | 'badge'>('id');
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
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* Header (48px) */}
      <header className="h-12 border-b border-[#E7E5E4] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider">ID-QR-KIT</span>
          <span className="text-[11px] text-[#A3A3A3] font-mono">v1.0.0</span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors"
        >
          GitHub
        </a>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Controls (320px) */}
        <aside className="w-80 border-r border-[#E7E5E4] flex flex-col">
          {/* Tabs Header */}
          <div className="flex border-b border-[#E7E5E4]">
            {(['id', 'qr', 'barcode', 'badge'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 h-10 text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-[#111111] border-b-2 border-[#111111]'
                    : 'text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Config Controls Options */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* ID Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                <label className="text-xs font-medium text-[#6B6B6B]">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-28 h-8 px-2 border border-[#E7E5E4] rounded text-xs focus:outline-none focus:border-[#111111]"
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
                  className="w-28 accent-[#111111]"
                />
              </div>

              <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                <label className="text-xs font-medium text-[#6B6B6B]">Charset</label>
                <select
                  value={charset}
                  onChange={(e) => setCharset(e.target.value as any)}
                  className="w-28 h-8 px-1 border border-[#E7E5E4] rounded text-xs focus:outline-none focus:border-[#111111]"
                >
                  <option value="alphanumeric">Alphanumeric</option>
                  <option value="alpha">Alpha</option>
                  <option value="numeric">Numeric</option>
                  <option value="hex">Hex</option>
                </select>
              </div>

              <button
                onClick={handleRegenerate}
                className="w-full h-9 mt-2 border border-[#E7E5E4] hover:bg-[#F5F5F5] rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} strokeWidth={1.75} />
                Regenerate ID
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
                    className="w-28 accent-[#111111]"
                  />
                </div>

                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">ECC Level</label>
                  <select
                    value={ecc}
                    onChange={(e) => setEcc(e.target.value as any)}
                    className="w-28 h-8 px-1 border border-[#E7E5E4] rounded text-xs focus:outline-none focus:border-[#111111]"
                  >
                    <option value="L">L (Low 7%)</option>
                    <option value="M">M (Medium 15%)</option>
                    <option value="Q">Q (Quartile 25%)</option>
                    <option value="H">H (High 30%)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'barcode' && (
              <div className="pt-2 border-t border-[#E7E5E4] space-y-3">
                <div className="flex items-center justify-between h-10 border-b border-[#F5F5F5]">
                  <label className="text-xs font-medium text-[#6B6B6B]">Format</label>
                  <select
                    value={barcodeFormat}
                    onChange={(e) => setBarcodeFormat(e.target.value as any)}
                    className="w-28 h-8 px-1 border border-[#E7E5E4] rounded text-xs focus:outline-none focus:border-[#111111]"
                  >
                    <option value="CODE128">CODE128</option>
                    <option value="CODE39">CODE39</option>
                    <option value="EAN13">EAN13</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Preview & Code Section */}
        <main className="flex-1 flex flex-col bg-[#FFFFFF]">
          {/* Top Barcode / Element Preview Stage */}
          <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-auto">
            {activeTab === 'id' && (
              <div className="flex flex-col items-center gap-2 p-6 border border-[#E7E5E4] rounded-lg">
                <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">
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
          </div>

          {/* Bottom Code Block */}
          <div className="border-t border-[#E7E5E4] bg-[#111111] text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A3A3A3]">
                React Code Snippet
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[#262626] hover:bg-[#333333] border border-[#404040] rounded transition-colors"
              >
                {copied ? <Check size={14} strokeWidth={1.75} /> : <Copy size={14} strokeWidth={1.75} />}
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