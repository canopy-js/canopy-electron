let fs = require('fs');
let indexFileText = fs.readFileSync('build/index.html').toString();
let defaultTopicName = indexFileText.match(/data-default-topic-mixed-case="(.*)"/)[1];
defaultTopicName = defaultTopicName.replace(/[!><:"|?*/\\]/g, '')
let packageJson = fs.readFileSync('package.json').toString();
packageJson = packageJson.replace(/Reader/g, defaultTopicName);
packageJson = packageJson.replace(/canopy-electron/g, defaultTopicName);
fs.writeFileSync('package.json', packageJson);
