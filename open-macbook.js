const path = require('path');
const { exec } = require('child_process');

// Get the absolute path to the HTML file
const htmlFilePath = path.resolve(__dirname, 'results', 'mac_book_results.html');
const fileUrl = `file:///${htmlFilePath.replace(/\\/g, '/')}`;

console.log(`Opening: ${fileUrl}`);

// Open in Chrome
const command = `start chrome "${fileUrl}"`;
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error opening file: ${error}`);
    return;
  }
  console.log('File opened successfully in Chrome!');
});
