import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlitghtData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [isLoading, setIsLoading] = useState(true);

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection
      .filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered
      .map(transaction => new Date(transaction.date).getTime())
    ));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
  }

  async function loadTransactions() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensivesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensivesTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency:  'BRL'
        })
        .replace('R$', 'R$ ');

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }
    })

    
    const total = entriesTotal - expensivesTotal;

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative'); 
    const totalInterval = lastTransactionExpensives === 0
    ? 'N??o h?? transa????es'
    : `01 a ${lastTransactionExpensives}`

    setTransactions(transactionsFormatted);
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency:  'BRL'
        })
        .replace('R$', 'R$ '),
        lastTransaction: lastTransactionEntries === 0 
          ? 'N??o h?? transa????es' 
          : `??ltima entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensivesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency:  'BRL'
        })
        .replace('R$', 'R$ '),
        lastTransaction: lastTransactionExpensives === 0
          ? 'N??o h?? transa????es' 
          : `??ltima sa??da dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency:  'BRL'
        })
        .replace('R$', 'R$ '),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? (
          <LoadContainer>
            <ActivityIndicator 
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer>
        ) : (
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo 
                    source={{ uri: user.photo }}
                  />

                  <User>
                    <UserGreeting>Ol??,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>
          
            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlitghtData.entries.amount}
                lastTransaction={highlitghtData.entries.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Sa??das"
                amount={highlitghtData.expensives.amount}
                lastTransaction={highlitghtData.expensives.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlitghtData.total.amount}
                lastTransaction={highlitghtData.total.lastTransaction}
              />
            </HighlightCards>
        
            <Transactions>
              <Title>Listagem</Title>

              <TransactionList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
              
            </Transactions>
          </>
        )
      }
    </Container>
  )
}
