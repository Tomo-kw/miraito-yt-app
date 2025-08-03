import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, "../public/icons");

function drawMiraitoIcon(ctx, size) {
  // Background circle - 黄色に変更
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Scale factors for different sizes
  const scale = size / 512;

  // Letter "m" design - 白色のまま
  ctx.fillStyle = "white";
  ctx.beginPath();

  // Define the "m" path scaled to the canvas size
  const points = [
    [140 * scale, 180 * scale],
    [140 * scale, 380 * scale],
    [180 * scale, 380 * scale],
    [180 * scale, 250 * scale],
    [220 * scale, 320 * scale],
    [250 * scale, 320 * scale],
    [290 * scale, 250 * scale],
    [290 * scale, 380 * scale],
    [330 * scale, 380 * scale],
    [330 * scale, 180 * scale],
    [290 * scale, 180 * scale],
    [235 * scale, 280 * scale],
    [180 * scale, 180 * scale],
  ];

  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
}

async function generateIcons() {
  try {
    for (const size of iconSizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext("2d");

      drawMiraitoIcon(ctx, size);

      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      console.log(`Generated icon: ${size}x${size}px`);
    }

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

generateIcons();
