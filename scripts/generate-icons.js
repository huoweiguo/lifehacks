const fs = require('fs');
const path = require('path');

const icons = {
  'home': { normal: '#999999', active: '#667eea' },
  'category': { normal: '#999999', active: '#667eea' },
  'favorite': { normal: '#999999', active: '#667eea' },
  'mine': { normal: '#999999', active: '#667eea' }
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const createSimplePNG = (color) => {
  const rgb = hexToRgb(color);
  const width = 48;
  const height = 48;
  
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const createChunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = crc32(crcData);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc >>> 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  };
  
  const crc32 = (buf) => {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return crc ^ 0xFFFFFFFF;
  };
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < 18) {
        rawData.push(rgb.r, rgb.g, rgb.b);
      } else {
        rawData.push(0, 0, 0, 0);
      }
    }
  }
  
  const rawBuffer = Buffer.from(rawData);
  const { deflateSync } = require('zlib');
  const compressed = deflateSync(rawBuffer);
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const tabDir = path.join(__dirname, '../static/tab');

Object.keys(icons).forEach(name => {
  const normalPng = createSimplePNG(icons[name].normal);
  const activePng = createSimplePNG(icons[name].active);
  
  fs.writeFileSync(path.join(tabDir, `${name}.png`), normalPng);
  fs.writeFileSync(path.join(tabDir, `${name}-active.png`), activePng);
  
  console.log(`Created ${name}.png and ${name}-active.png`);
});

console.log('All icons generated successfully!');