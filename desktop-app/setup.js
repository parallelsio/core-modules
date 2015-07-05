// Electrometeor uses the convenience script shelljs/global to reduce verbosity.
// If polluting your global namespace is not desirable, simply require shelljs.
//
// Example:
//
// var shell = require('shelljs');
// shell.echo('hello world');
'use strict';

require('shelljs/global');
var path = require('path');
var AdmZip = require('adm-zip');

// Auto-exit on errors
config.fatal = true;

// Get the directory of the current script
var dir = __dirname;
var base = path.normalize(path.join(dir, '..'));
cd(dir);

var nodeVersion = '0.10.36';
var npmVersion = '2.9.0'; // Only used on Windows.
var mongoVersion = '3.0.3';
var electronVersion = '0.28.1';

var osName = '';
var machineType = '';
var arch = '';

var removeExtension = function (fileName) {
  var charsToSlice = 0;
  if (fileName.indexOf('.tar.gz') !== -1) {
    charsToSlice = 7;
  } else {
    // .tgz, .zip
    charsToSlice = 4;
  }

  return fileName.slice(0, -(charsToSlice));
};

var onWindows = false;
osName = exec('echo %OS% | tr "[:upper:]" "[:lower:]" | xargs echo -n', {silent: true}).output;
if (osName.indexOf('windows') !== -1) {
  osName = 'win32';
  onWindows = true;
} else {
  osName = exec('uname -s | tr "[:upper:]" "[:lower:]" | xargs echo -n', {silent: true}).output;
  onWindows = false;
}

if (onWindows) {
  machineType = exec('echo %PROCESSOR_ARCHITECTURE% | xargs echo -n', {silent: true}).output;
} else {
  machineType = exec('uname -m | xargs echo -n', {silent: true}).output;
}

console.log('OS Name: ', osName);
console.log('Machine Type: ', machineType);

if (machineType === 'x86') {
  arch = '32-bit';
} else {
  arch = '64-bit';
}

console.log('Architecture is ', arch);

var npmFile = 'npm-' + npmVersion + '.zip';

var electronFile = 'electron-v' + electronVersion + '-' + osName + '-x64.zip';
var nodeFile = 'node-v' + nodeVersion + '-' + osName + '-x64.tar.gz';

cd(base);

if (!test('-d', 'desktop-app/resources')) {
  mkdir('desktop-app/resources');
}

if (!test('-d', 'desktop-app/cache')) {
  mkdir('desktop-app/cache');
}

cd('desktop-app/cache');

if (!test('-f', electronFile)) {
  echo('-----> Downloading Electron... (version: ' + electronVersion + ')');
  var electronCurl = 'curl --insecure -L -o '
    + electronFile
    + ' http://github.com/atom/electron/releases/download/v'
    + electronVersion + '/' + electronFile;
  exec(electronCurl);
  if (onWindows) {
    var electronZip = new AdmZip(electronFile);
    electronZip.extractAllTo('electron', true);
  } else {
    mkdir('electron');
    exec('unzip -d electron ' + electronFile);
  }
}

var os = osName === 'darwin' ? 'osx' : osName;
var mongoFile = 'mongodb-' + os + '-x86_64-' + mongoVersion + '.tgz';
echo('mongoFile = ' + mongoFile);

if (!test('-f', mongoFile)) {
  echo('-----> Downloading MongoDB... (version: ' + mongoVersion + ')');
  var mongoCurl = 'curl -L -o '
    + mongoFile
    + ' https://fastdl.mongodb.org/'
    + os + '/'
    + mongoFile;
  exec(mongoCurl);
  if (onWindows) {
    console.log('Unzipping MongoDB');
    var mongoZip = new AdmZip(mongoFile);
    mongoZip.extractAllTo('./', true);
  } else {
    exec('tar -zxvf ' + mongoFile);
  }
  var mongoDir = removeExtension(mongoFile);
  var mongod = process.platform === 'win32' ? 'mongod.exe' : 'mongod';
  cp(mongoDir + '/bin/' + mongod, base + '/desktop-app/resources/');
  cp(mongoDir + '/GNU-AGPL-3.0', base + '/desktop-app/resources/MONGOD_LICENSE.txt');
}

if (!test('-f', nodeFile)) {
  echo('-----> Downloading Node... (version: ' + nodeVersion + ')');
  var nodeCurl = 'curl -L -o '
    + nodeFile
    + ' http://nodejs.org/dist/'
    + 'v' + nodeVersion
    + '/' + nodeFile;
  exec(nodeCurl);
  if (onWindows) {
    mkdir('nodejs');
    cp('node.exe', base + '/desktop-app/resources/node.exe');
    cp('node.exe', './nodejs/node.exe');
  } else {
    mkdir('node');
    exec('tar -xzf ' + nodeFile + ' --strip-components 1 -C node');
    cp('node/bin/node', base + '/desktop-app/resources/node');
    cp('node/LICENSE', base + '/desktop-app/resources/NODE_LICENSE.txt');
  }
}

// Windows needs to download NPM because it's not included with Node.
if (onWindows) {
  if (!test('-f', npmFile)) {
    echo('-----> Downloading NPM... (version: ' + npmVersion + ')');
    var npmCurl = 'curl -L -o '
      + npmFile
      + ' https://github.com/npm/npm/archive/'
      + 'v' + npmVersion
      + '.zip';
    exec(npmCurl);
    var npmZip = new AdmZip(npmFile);
    npmZip.extractAllTo('./nodejs/node_modules/', true);
    mv('./nodejs/node_modules/npm-' + npmVersion, './nodejs/node_modules/npm');
    cp('./nodejs/node_modules/npm/bin/npm', './nodejs');
    cp('./nodejs/node_modules/npm/bin/npm.cmd', './nodejs');
  }
}
