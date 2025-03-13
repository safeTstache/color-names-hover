
const builder = require('electron-builder');
const path = require('path');

builder.build({
  config: {
    appId: 'com.lovable.colorpicker',
    productName: 'Color Picker',
    directories: {
      output: 'dist-electron',
      buildResources: 'electron'
    },
    mac: {
      category: 'public.app-category.utilities',
      target: ['dmg'],
      icon: path.join(__dirname, 'icon.png')
    },
    files: [
      'dist/**/*',
      'electron/**/*'
    ],
    extraMetadata: {
      main: 'electron/main.js'
    }
  }
});
