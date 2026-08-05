const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Create vector SVG for ME logo
// Canvas 512x512 with near-black rounded background and elegant Cormorant Garamond style serif ME text
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <style>
    .bg { fill: #0d0d0d; }
    .text { fill: #f472b6; font-family: 'Cormorant Garamond', Didot, 'Bodoni MT', 'Cinzel', 'Times New Roman', serif; font-weight: 700; font-size: 260px; letter-spacing: -8px; text-anchor: middle; dominant-baseline: central; }
    @media (prefers-color-scheme: light) {
      .bg { fill: #0d0d0d; }
      .text { fill: #f472b6; }
    }
  </style>
  <rect class="bg" width="512" height="512" rx="110" />
  <!-- Elegant Serif ME Text -->
  <text x="252" y="260" class="text">ME</text>
</svg>`;

const publicDir = path.join(process.cwd(), "public");
const appDir = path.join(process.cwd(), "src", "app");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);

  // 1. Write public/favicon.svg
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), svgContent);
  console.log("✅ Created public/favicon.svg");

  // 2. Render PNG 16x16
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), png16);
  console.log("✅ Created public/favicon-16x16.png");

  // 3. Render PNG 32x32
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), png32);
  console.log("✅ Created public/favicon-32x32.png");

  // 4. Render Apple Touch Icon 180x180
  const appleTouch = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleTouch);
  console.log("✅ Created public/apple-touch-icon.png");

  // 5. Write favicon.ico using PNG buffer (supported natively by browsers & Next.js)
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), png32);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), png32);
  console.log("✅ Created public/favicon.ico and src/app/favicon.ico");
}

generateFavicons().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
