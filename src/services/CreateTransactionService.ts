import { getRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const category_insert = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(category_insert);

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: category_insert.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
