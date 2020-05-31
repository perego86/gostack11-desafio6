import fs from 'fs';

import loadCSV from '../util/CSVUtil';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(Filepath: string): Promise<Transaction[]> {
    const transactionsSaved = new Array<Transaction>();
    const lines = await loadCSV(Filepath);

    fs.unlink(Filepath, () => null);

    for (const item of lines) {
      const createTransaction = new CreateTransactionService();

      const transaction = await createTransaction.execute({
        title: item.title,
        value: item.value,
        type: item.type,
        categoryTitle: item.category_id,
      });

      transactionsSaved.push(transaction);
    }

    return transactionsSaved;
  }
}

export default ImportTransactionsService;
