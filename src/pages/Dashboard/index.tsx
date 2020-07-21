import React, { useState, useEffect } from 'react';

import incomeSVG from '../../assets/income.svg';
import outcomeSVG from '../../assets/outcome.svg';
import totalSVG from '../../assets/total.svg';

import api from '../../services/api';
import Header from '../../components/Header';
import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const formatedTransactions = response.data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: new Date(transaction.created_at).toLocaleDateString(
            'pt-BR',
          ),
        }),
      );
      setTransactions(formatedTransactions);

      const { income, outcome, total } = response.data.balance;
      setBalance({
        income: formatValue(income),
        outcome: formatValue(outcome),
        total: formatValue(total),
      });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={incomeSVG} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcomeSVG} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={totalSVG} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(
                ({
                  id,
                  title,
                  type,
                  category,
                  formattedValue,
                  formattedDate,
                }) => (
                    <tr key={id}>
                      <td className="title">{title}</td>
                      <td className={type}>
                        {type === 'outcome' && ' - '}
                        {formattedValue}
                      </td>
                      <td>{category.title}</td>
                      <td>{formattedDate}</td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
