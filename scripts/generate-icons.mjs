import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, "../public/icons/icon-base.svg");
const outputDir = path.join(__dirname, "../public/icons");

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(inputSvg);

    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);

      console.log(`Generated icon: ${size}x${size}px`);
    }

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

generateIcons();
