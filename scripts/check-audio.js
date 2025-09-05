const fs = require('fs');
const path = require('path');

const audioFiles = [
  'public/audio/birthday-song.mp3',
  'public/audio/success-sound.mp3', 
  'public/audio/click-sound.mp3',
  'public/audio/notification-sound.mp3'
];

console.log('Checking audio files...\n');

audioFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ ${file} - ${sizeInMB}MB`);
  } else {
    console.log(`❌ ${file} - FILE NOT FOUND`);
  }
});

console.log('\nAudio setup complete!');