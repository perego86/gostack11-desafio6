import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

async function loadCSV(filePath: string): Promise<Transaction[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const lines = new Array<Transaction>();
  const parseCSV = readCSVStream.pipe(parseStream);

  parseCSV.on('data', line => {
    const trans = new Transaction();
    trans.title = line[0];
    trans.type = line[1];
    trans.value = line[2];
    trans.category_id = line[3];

    lines.push(trans);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  fs.unlinkSync(filePath);

  return lines;
}
export default loadCSV;
