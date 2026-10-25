const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Customer App Icon SVG Generator
function generateCustomerSvg(size) {
  const half = size / 2;
  const fontSizeMain = Math.round(size * 0.36);
  const fontSizeSub = Math.round(size * 0.11);
  const strokeW = Math.max(2, Math.round(size * 0.02));
  const r = Math.round(size * 0.22);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050A17" />
        <stop offset="50%" stop-color="#070D1E" />
        <stop offset="100%" stop-color="#0D1E3A" />
      </linearGradient>
      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22D3EE" />
        <stop offset="50%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0284C7" />
      </linearGradient>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.3" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.03}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background squircle -->
    <rect width="${size}" height="${size}" rx="${r}" fill="url(#bgGrad)" />
    <rect x="${strokeW/2}" y="${strokeW/2}" width="${size - strokeW}" height="${size - strokeW}" rx="${r}" fill="none" stroke="url(#borderGrad)" stroke-width="${strokeW}" />

    <!-- Ambient Glow behind logo -->
    <circle cx="${half}" cy="${half * 0.85}" r="${size * 0.28}" fill="#06B6D4" opacity="0.18" filter="url(#glow)" />

    <!-- Cart / Bag Outline Accent -->
    <path d="M ${half - size*0.28} ${half*0.5} L ${half + size*0.28} ${half*0.5} L ${half + size*0.22} ${half*1.35} L ${half - size*0.22} ${half*1.35} Z" 
          fill="none" stroke="#06B6D4" stroke-opacity="0.12" stroke-width="${strokeW}" rx="${size*0.04}" />

    <!-- AS Monogram -->
    <text x="${half}" y="${half * 0.98}" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" 
          font-size="${fontSizeMain}" 
          font-weight="900" 
          text-anchor="middle" 
          fill="url(#cyanGrad)" 
          letter-spacing="${size * 0.02}">AS</text>

    <!-- Subtitle Pill (STORE) -->
    <rect x="${half - size*0.26}" y="${half * 1.18}" width="${size*0.52}" height="${size*0.17}" rx="${size*0.085}" fill="#06B6D4" />
    <text x="${half}" y="${half * 1.30}" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" 
          font-size="${fontSizeSub}" 
          font-weight="900" 
          text-anchor="middle" 
          fill="#070D1E" 
          letter-spacing="${size * 0.015}">STORE</text>
  </svg>
  `;
}

// Admin App Icon SVG Generator
function generateAdminSvg(size) {
  const half = size / 2;
  const fontSizeMain = Math.round(size * 0.35);
  const fontSizeSub = Math.round(size * 0.10);
  const strokeW = Math.max(2, Math.round(size * 0.02));
  const r = Math.round(size * 0.22);

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="adminBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617" />
        <stop offset="50%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="50%" stop-color="#818CF8" />
        <stop offset="100%" stop-color="#C084FC" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCD34D" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
      <linearGradient id="adminBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#A855F7" stop-opacity="0.4" />
      </linearGradient>
      <filter id="adminGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.03}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background squircle -->
    <rect width="${size}" height="${size}" rx="${r}" fill="url(#adminBg)" />
    <rect x="${strokeW/2}" y="${strokeW/2}" width="${size - strokeW}" height="${size - strokeW}" rx="${r}" fill="none" stroke="url(#adminBorder)" stroke-width="${strokeW}" />

    <!-- Ambient Executive Glow -->
    <circle cx="${half}" cy="${half * 0.85}" r="${size * 0.3}" fill="#38BDF8" opacity="0.15" filter="url(#adminGlow)" />

    <!-- Security Shield / Shield Watermark -->
    <path d="M ${half} ${half*0.35} 
             Q ${half + size*0.28} ${half*0.42} ${half + size*0.28} ${half*0.95} 
             Q ${half + size*0.28} ${half*1.32} ${half} ${half*1.55} 
             Q ${half - size*0.28} ${half*1.32} ${half - size*0.28} ${half*0.95} 
             Q ${half - size*0.28} ${half*0.42} ${half} ${half*0.35} Z" 
          fill="none" stroke="#38BDF8" stroke-opacity="0.18" stroke-width="${strokeW}" />

    <!-- AS Monogram -->
    <text x="${half}" y="${half * 0.96}" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" 
          font-size="${fontSizeMain}" 
          font-weight="900" 
          text-anchor="middle" 
          fill="url(#shieldGrad)" 
          letter-spacing="${size * 0.02}">AS</text>

    <!-- Subtitle Pill (ADMIN) -->
    <rect x="${half - size*0.27}" y="${half * 1.18}" width="${size*0.54}" height="${size*0.17}" rx="${size*0.085}" fill="url(#goldGrad)" />
    <text x="${half}" y="${half * 1.30}" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" 
          font-size="${fontSizeSub}" 
          font-weight="900" 
          text-anchor="middle" 
          fill="#0F172A" 
          letter-spacing="${size * 0.02}">ADMIN</text>
  </svg>
  `;
}

async function run() {
  const targets = [
    { name: 'icon-192.png', size: 192, type: 'customer' },
    { name: 'icon-512.png', size: 512, type: 'customer' },
    { name: 'icon-customer-192.png', size: 192, type: 'customer' },
    { name: 'icon-customer-512.png', size: 512, type: 'customer' },
    { name: 'icon-admin-192.png', size: 192, type: 'admin' },
    { name: 'icon-admin-512.png', size: 512, type: 'admin' },
  ];

  for (const t of targets) {
    const svg = t.type === 'admin' ? generateAdminSvg(t.size) : generateCustomerSvg(t.size);
    const dest = path.join(publicDir, t.name);
    await sharp(Buffer.from(svg)).png().toFile(dest);
    console.log(`Generated ${t.name} (${t.size}x${t.size}) -> ${dest}`);
  }

  // Generate ICO files for Windows shortcuts
  function makeIco(pngPath, icoPath) {
    const pngBuf = fs.readFileSync(pngPath);
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(1, 4);
    const dir = Buffer.alloc(16);
    dir.writeUInt8(0, 0);
    dir.writeUInt8(0, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(pngBuf.length, 8);
    dir.writeUInt32LE(22, 12);
    fs.writeFileSync(icoPath, Buffer.concat([header, dir, pngBuf]));
    console.log(`Generated ICO: ${icoPath}`);
  }

  makeIco(path.join(publicDir, 'icon-customer-192.png'), path.join(publicDir, 'customer.ico'));
  makeIco(path.join(publicDir, 'icon-admin-192.png'), path.join(publicDir, 'admin.ico'));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
