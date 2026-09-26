// izeeg AI - Standart GS1 / ISO / IEC 15417 Uyumlu Code 128 Barkod Üretim Motoru
// Kargo firmalarının (Trendyol Express, Yurtiçi, Aras, MNG, HepsiJET, Sürat, PTT, Kolay Gelsin vb.)
// el terminalleri ve lazer barkod okuyucuları tarafından %100 okunabilir vektörel barkod üretir.

import React from 'react';

// Code 128 Tablosu (107 Sembol Deseni - 6 genişlik değeri: çubuk, boşluk, çubuk, boşluk, çubuk, boşluk)
const CODE128_PATTERNS = [
  [2, 1, 2, 2, 2, 2], // 0:  ' '
  [2, 2, 2, 1, 2, 2], // 1:  '!'
  [2, 2, 2, 2, 2, 1], // 2:  '"'
  [1, 2, 1, 2, 2, 3], // 3:  '#'
  [1, 2, 1, 3, 2, 2], // 4:  '$'
  [1, 3, 1, 2, 2, 2], // 5:  '%'
  [1, 2, 2, 2, 1, 3], // 6:  '&'
  [1, 2, 2, 3, 1, 2], // 7:  "'"
  [1, 3, 2, 2, 1, 2], // 8:  '('
  [2, 2, 1, 2, 1, 3], // 9:  ')'
  [2, 2, 1, 3, 1, 2], // 10: '*'
  [2, 3, 1, 2, 1, 2], // 11: '+'
  [1, 1, 2, 2, 3, 2], // 12: ','
  [1, 2, 2, 1, 3, 2], // 13: '-'
  [1, 2, 2, 2, 3, 1], // 14: '.'
  [1, 1, 3, 2, 2, 2], // 15: '/'
  [1, 2, 3, 1, 2, 2], // 16: '0'
  [1, 2, 3, 2, 2, 1], // 17: '1'
  [2, 2, 3, 2, 1, 1], // 18: '2'
  [2, 2, 1, 1, 3, 2], // 19: '3'
  [2, 2, 1, 2, 3, 1], // 20: '4'
  [2, 1, 3, 2, 1, 2], // 21: '5'
  [2, 2, 3, 1, 1, 2], // 22: '6'
  [3, 1, 2, 1, 3, 1], // 23: '7'
  [3, 1, 1, 2, 2, 2], // 24: '8'
  [3, 2, 1, 1, 2, 2], // 25: '9'
  [3, 2, 1, 2, 2, 1], // 26: ':'
  [3, 1, 2, 2, 1, 2], // 27: ';'
  [3, 2, 2, 1, 1, 2], // 28: '<'
  [3, 2, 2, 2, 1, 1], // 29: '='
  [2, 1, 2, 1, 2, 3], // 30: '>'
  [2, 1, 2, 3, 2, 1], // 31: '?'
  [2, 3, 2, 1, 2, 1], // 32: '@'
  [1, 1, 1, 3, 2, 3], // 33: 'A'
  [1, 3, 1, 1, 2, 3], // 34: 'B'
  [1, 3, 1, 3, 2, 1], // 35: 'C'
  [1, 1, 2, 3, 1, 3], // 36: 'D'
  [1, 3, 2, 1, 1, 3], // 37: 'E'
  [1, 3, 2, 3, 1, 1], // 38: 'F'
  [2, 1, 1, 3, 1, 3], // 39: 'G'
  [2, 3, 1, 1, 1, 3], // 40: 'H'
  [2, 3, 1, 3, 1, 1], // 41: 'I'
  [1, 1, 2, 1, 3, 3], // 42: 'J'
  [1, 1, 2, 3, 3, 1], // 43: 'K'
  [1, 3, 2, 1, 3, 1], // 44: 'L'
  [1, 1, 3, 1, 2, 3], // 45: 'M'
  [1, 1, 3, 3, 2, 1], // 46: 'N'
  [1, 3, 3, 1, 2, 1], // 47: 'O'
  [3, 1, 3, 1, 2, 1], // 48: 'P'
  [2, 1, 1, 3, 3, 1], // 49: 'Q'
  [2, 3, 1, 1, 3, 1], // 50: 'R'
  [2, 1, 3, 1, 1, 3], // 51: 'S'
  [2, 1, 3, 3, 1, 1], // 52: 'T'
  [2, 1, 3, 1, 3, 1], // 53: 'U'
  [3, 1, 1, 1, 2, 3], // 54: 'V'
  [3, 1, 1, 3, 2, 1], // 55: 'W'
  [3, 3, 1, 1, 2, 1], // 56: 'X'
  [3, 1, 2, 1, 1, 3], // 57: 'Y'
  [3, 1, 2, 3, 1, 1], // 58: 'Z'
  [3, 3, 2, 1, 1, 1], // 59: '['
  [3, 1, 4, 1, 1, 1], // 60: '\\'
  [2, 2, 1, 4, 1, 1], // 61: ']'
  [4, 3, 1, 1, 1, 1], // 62: '^'
  [1, 1, 1, 2, 2, 4], // 63: '_'
  [1, 1, 1, 4, 2, 2], // 64: '`'
  [1, 2, 1, 1, 2, 4], // 65: 'a'
  [1, 2, 1, 4, 2, 1], // 66: 'b'
  [1, 4, 1, 1, 2, 2], // 67: 'c'
  [1, 4, 1, 2, 2, 1], // 68: 'd'
  [1, 1, 2, 2, 1, 4], // 69: 'e'
  [1, 1, 2, 4, 1, 2], // 70: 'f'
  [1, 2, 2, 1, 1, 4], // 71: 'g'
  [1, 2, 2, 4, 1, 1], // 72: 'h'
  [1, 4, 2, 1, 1, 2], // 73: 'i'
  [1, 4, 2, 2, 1, 1], // 74: 'j'
  [2, 4, 1, 2, 1, 1], // 75: 'k'
  [2, 2, 1, 1, 1, 4], // 76: 'l'
  [4, 1, 3, 1, 1, 1], // 77: 'm'
  [2, 4, 1, 1, 1, 2], // 78: 'n'
  [1, 3, 4, 1, 1, 1], // 79: 'o'
  [1, 1, 1, 2, 4, 2], // 80: 'p'
  [1, 2, 1, 1, 4, 2], // 81: 'q'
  [1, 2, 1, 2, 4, 1], // 82: 'r'
  [1, 1, 4, 2, 1, 2], // 83: 's'
  [1, 2, 4, 1, 1, 2], // 84: 't'
  [1, 2, 4, 2, 1, 1], // 85: 'u'
  [4, 1, 1, 2, 1, 2], // 86: 'v'
  [4, 2, 1, 1, 1, 2], // 87: 'w'
  [4, 2, 1, 2, 1, 1], // 88: 'x'
  [2, 1, 2, 1, 4, 1], // 89: 'y'
  [2, 1, 4, 1, 2, 1], // 90: 'z'
  [4, 1, 2, 1, 2, 1], // 91: '{'
  [1, 1, 1, 1, 4, 3], // 92: '|'
  [1, 1, 1, 3, 4, 1], // 93: '}'
  [1, 3, 1, 1, 4, 1], // 94: '~'
  [1, 1, 4, 1, 1, 3], // 95: DEL
  [1, 1, 4, 3, 1, 1], // 96: FNC3
  [4, 1, 1, 1, 1, 3], // 97: FNC2
  [4, 1, 1, 3, 1, 1], // 98: SHIFT
  [1, 1, 3, 1, 4, 1], // 99: CODE_C
  [1, 1, 4, 1, 3, 1], // 100: CODE_B
  [3, 1, 1, 1, 4, 1], // 101: CODE_A
  [4, 1, 1, 1, 3, 1], // 102: FNC1
  [2, 1, 1, 4, 1, 2], // 103: START_A
  [2, 1, 1, 2, 1, 4], // 104: START_B
  [2, 1, 1, 2, 3, 2], // 105: START_C
  [2, 3, 3, 1, 1, 1, 2] // 106: STOP (7 elemanlıdır)
];

const START_B = 104;
const STOP = 106;

/**
 * Verilen metni standart Code 128 (B alt kümesi) dizisine dönüştürür
 * ve resmi modül genişlik dizisini hesaplar.
 */
export function encodeCode128(text) {
  if (!text || typeof text !== 'string') {
    text = '0000000000';
  }

  // Sadece ASCII karakterler (boşluk dahil)
  const cleanText = text.replace(/[^\x20-\x7E]/g, '');
  const charCodes = [];

  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i) - 32;
    if (code >= 0 && code <= 95) {
      charCodes.push(code);
    }
  }

  if (charCodes.length === 0) {
    charCodes.push(16); // '0'
  }

  // Checksum hesaplama: (START_CODE + sum(position * char_code)) % 103
  let checksum = START_B;
  for (let i = 0; i < charCodes.length; i++) {
    checksum += (i + 1) * charCodes[i];
  }
  checksum = checksum % 103;

  // Semboller dizisi: START_B + Veri Kodları + Checksum + STOP
  const symbols = [START_B, ...charCodes, checksum, STOP];

  // Modülleri hesapla (her 1 birim genişlik bir modüldür)
  const modules = []; // true = bar (siyah), false = space (beyaz)

  symbols.forEach((symIdx) => {
    const pattern = CODE128_PATTERNS[symIdx];
    if (!pattern) return;

    let isBar = true;
    for (let p = 0; p < pattern.length; p++) {
      const width = pattern[p];
      for (let w = 0; w < width; w++) {
        modules.push(isBar);
      }
      isBar = !isBar;
    }
  });

  return {
    text: cleanText,
    modules: modules,
    totalModules: modules.length
  };
}

/**
 * 100% Standart Vektörel Code 128 Barkod React Bileşeni
 * Lazer ve optik barkod okuyucu tabancaların anında yakalayabilmesi için
 * ISO/IEC 15417 standartlarına uygun quiet-zone (sessiz alan) ve yüksek kontrast içerir.
 */
export function Barcode128({ 
  value = '', 
  height = 56, 
  moduleWidth = 2.2, 
  className = '',
  showLabel = false,
  labelStyle = '',
  quietZone = 12
}) {
  const cleanVal = String(value || '').trim();
  if (!cleanVal) return null;

  const encoded = encodeCode128(cleanVal);
  const totalWidth = (encoded.totalModules + (quietZone * 2)) * moduleWidth;

  // Çubukları SVG Rect olarak birleştir (daha hızlı ve ultra keskin çizim)
  const rects = [];
  let currentBarStart = null;
  let currentBarWidth = 0;

  for (let i = 0; i < encoded.modules.length; i++) {
    const isBlack = encoded.modules[i];
    const xPos = (quietZone + i) * moduleWidth;

    if (isBlack) {
      if (currentBarStart === null) {
        currentBarStart = xPos;
        currentBarWidth = moduleWidth;
      } else {
        currentBarWidth += moduleWidth;
      }
    } else {
      if (currentBarStart !== null) {
        rects.push(
          <rect
            key={`bar-${rects.length}`}
            x={currentBarStart}
            y={0}
            width={currentBarWidth}
            height={height}
            fill="#000000"
          />
        );
        currentBarStart = null;
        currentBarWidth = 0;
      }
    }
  }

  if (currentBarStart !== null) {
    rects.push(
      <rect
        key={`bar-${rects.length}`}
        x={currentBarStart}
        y={0}
        width={currentBarWidth}
        height={height}
        fill="#000000"
      />
    );
  }

  return (
    <div className={`flex flex-col items-center select-none bg-white p-1 rounded ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Beyaz Arka Plan (Quiet Zone Garantisi) */}
        <rect x="0" y="0" width={totalWidth} height={height} fill="#FFFFFF" />
        
        {/* Keskin Siyah Barkod Çubukları */}
        {rects}
      </svg>

      {showLabel && (
        <div className={`font-mono font-black tracking-widest text-slate-900 text-xs mt-1 text-center ${labelStyle}`}>
          {cleanVal}
        </div>
      )}
    </div>
  );
}
