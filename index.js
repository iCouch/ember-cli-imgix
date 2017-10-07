/* eslint-env node */
'use strict';
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const path = require('path');
const map = require('broccoli-stew').map;
const Webpack = require('broccoli-webpack');

const transformAMD = (name) => ({
  using: [{ transformation: 'amd', as: name }]
});

const funnel = (name, destDir, files) => new Funnel(path.dirname(require.resolve(name)), {
  destDir,
  files
});
const packOpts = (name, fileName) => ({
  entry: path.dirname(require.resolve(name)) + `/${fileName}`,
  output: {
    filename: `imgix/${name}.js`,
    library: name,
    libraryTarget: 'umd'
  }
});
module.exports = {
  name: 'ember-cli-imgix',
  normalizeEntityName: function () {},


  included: function (app) {
    this._super.included(app);

    app.import('vendor/imgix/crypt.js', transformAMD('crypt'));
    app.import('vendor/imgix/charenc.js', transformAMD('charenc'));
    app.import('vendor/imgix/is-buffer.js', transformAMD('is-buffer'));
    
    app.import('vendor/imgix/md5.js', transformAMD('md5'));
    app.import('vendor/imgix/base64.min.js');
    app.import('vendor/imgix/imgix-core-js.js');
    app.import('vendor/urijs/URI.js');
    
  },

  treeForVendor() {
    var urijsFiles = new Funnel(path.dirname(require.resolve('urijs')), {
      destDir: 'urijs',
      files: ['URI.js']
    });

    var imgixFiles = new Funnel(path.dirname(require.resolve('imgix-core-js')), {
      destDir: 'imgix',
      files: ['imgix-core-js.js']
    });



    const packedCryptFiles = new Webpack([funnel('crypt', 'imgix', ['crypt.js'])], packOpts('crypt', 'crypt.js'));
    const packedCharencFiles = new Webpack([funnel('charenc', 'imgix', ['charenc.js'])], packOpts('charenc', 'charenc.js'));
    const packedBufferFiles = new Webpack([funnel('is-buffer', 'imgix', ['index.js'])], packOpts('is-buffer', 'index.js'));
    const packedMD5Files = new Webpack([funnel('md5', 'imgix', ['md5.js'])], packOpts('md5', 'md5.js'));
    

    var base64Files = new Funnel(path.dirname(require.resolve('js-base64')), {
      destDir: 'imgix',
      files: ['base64.min.js']
    });

    urijsFiles = map(urijsFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    imgixFiles = map(imgixFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    base64Files = map(base64Files, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
    

    return new MergeTrees([urijsFiles, packedCryptFiles, packedCharencFiles, packedMD5Files, base64Files, imgixFiles, packedBufferFiles]);
  }
};
