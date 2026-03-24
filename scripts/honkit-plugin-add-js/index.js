const path = require('path');
const fs = require('fs');
const os = require('os');
const tmp = require('tmp');
const crypto = require('crypto');

function ensureDirectoryExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true, mode: 0o755 });
  }
}

module.exports = {
  website: function () {
    const book = this;

    // Use safe tmpdir. Node's default os.tmpdir() can contain odd root paths.
    let rootTemp = os.tmpdir();
    if (path.parse(rootTemp).root.toLowerCase() === path.normalize(rootTemp).toLowerCase()) {
      rootTemp = path.join(process.cwd(), '.tmp');
    }

    ensureDirectoryExists(rootTemp);

    const tmpobj = tmp.dirSync({ mode: 0o755, tmpdir: rootTemp });

    const customJs = book.config.get('pluginsConfig.add-js.js', []);
    const jsFiles = [];

    if (!book.isLanguageBook()) {
      customJs.forEach((file) => {
        const origin = book.resolve(file);
        const filename = `${crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '').substring(0, 16)}-${path.basename(origin)}`;
        const output = path.join(tmpobj.name, filename);

        ensureDirectoryExists(path.dirname(output));

        const content = fs.readFileSync(origin);
        fs.writeFileSync(output, content);

        jsFiles.push(filename);
      });
    }

    return {
      assets: tmpobj.name,
      js: jsFiles,
    };
  },
};
