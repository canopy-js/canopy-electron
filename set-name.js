let fs = require('fs');
let indexFileText = fs.readFileSync('build/index.html').toString();
let defaultTopicName = indexFileText.match(/data-default-topic="(.*)"/)[1];
let packageJson = fs.readFileSync('package.json').toString();
packageJson = packageJson.replace(/Reader/g, defaultTopicName);
packageJson = packageJson.replace(/canopy-electron/g, defaultTopicName);
fs.writeFileSync('package.json', packageJson);
