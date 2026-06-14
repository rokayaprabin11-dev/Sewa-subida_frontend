const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the target dimensions and compression quality
const imagesToOptimize = [
  { name: 'planting.webp', width: 460, height: 350, quality: 70 },
  { name: 'dream.webp', width: 800, height: null, quality: 70 },
  { name: 'community.webp', width: 600, height: null, quality: 70 },
  { name: 'service1.webp', width: 648, height: 486, quality: 70 },
  { name: 'service4.webp', width: 648, height: 486, quality: 70 },
  { name: 'service5.webp', width: 648, height: 436, quality: 70 }
];

async function processImages() {
  const imgDir = path.join(__dirname, 'images');
  
  for (const img of imagesToOptimize) {
    const inputPath = path.join(imgDir, img.name);
    const outputPath = path.join(imgDir, `optimized_${img.name}`);

    if (fs.existsSync(inputPath)) {
      console.log(`Optimizing ${img.name}...`);
      try {
        // Read into buffer first to release the file lock on Windows
        const inputBuffer = fs.readFileSync(inputPath);
        await sharp(inputBuffer)
          .resize({ width: img.width, height: img.height, fit: 'cover' })
          .webp({ quality: img.quality, effort: 6 })
          .toFile(outputPath);
        
        // Replace the original file with the newly optimized one
        fs.renameSync(outputPath, inputPath);
        console.log(`✅ Successfully resized & compressed ${img.name}`);
      } catch (err) {
        console.error(`❌ Error processing ${img.name}:`, err.message);
      }
    } else {
      console.warn(`⚠️ File not found: ${inputPath}`);
    }
  }
}

processImages();