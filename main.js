import { readFile, writeFile } from 'fs';

const fileName = process.argv[2].replace('.json', '');
const optimalFile = `${fileName}.optimal.json`
const utf8Encoding = { encoding: 'utf8' };

readFile(`${fileName}.json`, utf8Encoding, (err, data) => {
  if (err) throw err;

  writeFile(optimalFile, data, (err) => {
    if (err) throw err;
  })
});
