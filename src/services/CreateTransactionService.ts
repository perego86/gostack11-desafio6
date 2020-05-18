import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';

  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = await categoriesRepository.save({ title: categoryTitle });
    }

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('This type of transaction is not valid');
    }

    if (
      type === 'outcome' &&
      value > (await transactionsRepository.getBalance()).total
    ) {
      throw new AppError('The balance is insufficient');
    }

    let transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    transaction = await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
