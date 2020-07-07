import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };

    /* const types = await this.createQueryBuilder('transactions')
      .select('transactions.type')
      .addSelect('SUM(transactions.value)', 'sum')
      .groupBy('transactions.type')
      .getRawMany();

    let outcome = 0;
    let income = 0;

    for (let i = 0; i < types.length; i += 1) {
      if (types[i].transactions_type === 'outcome') {
        outcome += types[i].sum;
      } else {
        income += types[i].sum;
      }
    }

    const balance = {
      income,
      outcome,
      total: income + outcome,
    };

    return balance; */
  }
}

export default TransactionsRepository;
