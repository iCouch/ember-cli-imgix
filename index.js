/* eslint-env node */
'use strict';
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const path = require('path');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-cli-imgix',
  normalizeEntityName: function() {},
  

  included: function(app) {
    this._super.included(app);
    // this.app.import(app.bowerDirectory + '/md5/build/md5.min.js');
    // this.app.import(app.bowerDirectory + '/urijs/src/URI.js');
    // this.app.import(app.bowerDirectory + '/js-base64/base64.js');
    app.import('vendor/imgix/imgix-core-js.min.js');
    app.import('vendor/urijs/URI.min.js');
  },

  treeForVendor() {
    var urijsFiles = new Funnel( path.dirname(require.resolve('urijs')), {
      destDir: 'urijs',
      files:['URI.min.js']});
      
    var imgixFiles = new Funnel( path.dirname(require.resolve('imgix-core-js')), {
        destDir: 'imgix',
        files:['imgix-core-js.min.js']});
        
    urijsFiles = map(urijsFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    imgixFiles = map(imgixFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    

    return new MergeTrees([urijsFiles, imgixFiles]);
  }
};
