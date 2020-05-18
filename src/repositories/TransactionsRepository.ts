import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();

    const incomeTotal = transactions.reduce(
      (total, currentValue) =>
        total + (currentValue.type === 'income' ? currentValue.value : 0),
      0,
    );
    const outcomeTotal = transactions.reduce(
      (total, currentValue) =>
        total + (currentValue.type === 'outcome' ? currentValue.value : 0),
      0,
    );

    return {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };
  }
}

export default TransactionsRepository;
