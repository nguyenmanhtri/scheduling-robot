import { readFile, writeFile } from 'fs';

import { getOptimalSchedule } from './utils/getOptimalSchedule';

// eslint-disable-next-line no-undef
const fileName = process.argv[2].replace('.json', '');
const optimalFile = `${fileName}.optimal.json`
const utf8Encoding = { encoding: 'utf8' };

readFile(`${fileName}.json`, utf8Encoding, (err, data) => {
  if (err) throw err;
  const parsedData = JSON.parse(data).map(item => ({
    ...item,
    startObj: new Date(item.start),
    finishObj: new Date(item.finish),
  }));
  const optimalSchedule = getOptimalSchedule(parsedData);

  writeFile(optimalFile, JSON.stringify(optimalSchedule), (err) => {
    if (err) throw err;
  })
});
