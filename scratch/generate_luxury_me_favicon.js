const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Vector path for luxury serif M and E letters for 100% pixel-perfect deterministic rendering everywhere
// Designed on a 512x512 canvas
const luxuryMeSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <style>
      .bg { fill: #0d0d0d; }
      .brand-pink { fill: #f472b6; }
    </style>
  </defs>
  <!-- Background Canvas -->
  <rect class="bg" width="512" height="512" rx="115" />
  
  <!-- Group for ME letterforms centered -->
  <g class="brand-pink" transform="translate(48, 128) scale(1.6)">
    <!-- Letter M (Serif Luxury Style) -->
    <path d="M 20 150 L 20 140 L 32 140 L 32 20 L 20 20 L 20 10 L 65 10 L 65 20 L 52 20 L 52 110 L 105 10 L 120 10 L 172 110 L 172 20 L 160 20 L 160 10 L 205 10 L 205 20 L 192 20 L 192 140 L 205 140 L 205 150 L 168 150 L 168 140 L 180 140 L 180 40 L 128 145 L 112 145 L 60 40 L 60 140 L 72 140 L 72 150 Z" />

    <!-- Letter E (Serif Luxury Style) -->
    <path d="M 215 150 L 215 140 L 228 140 L 228 20 L 215 20 L 215 10 L 285 10 L 285 42 L 273 42 L 270 22 L 248 22 L 248 72 L 275 72 L 275 84 L 248 84 L 248 138 L 275 138 L 278 118 L 290 118 L 290 150 Z" />
  </g>
</svg>`;

const publicDir = path.join(process.cwd(), "public");
const appDir = path.join(process.cwd(), "src", "app");

async function generate() {
  const svgBuffer = Buffer.from(luxuryMeSvgContent);

  // Write SVG
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), luxuryMeSvgContent);

  // PNG 16x16
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), png16);

  // PNG 32x32
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), png32);

  // Apple Touch Icon 180x180
  const appleTouch = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouch);

  // Favicon.ico
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), png32);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), png32);

  console.log("✨ Luxury vector ME favicons generated successfully!");
}

generate().catch(console.error);
