import React from 'react';

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
  TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de site',
      amount: 'R$ 16.390,00',
      category: {
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date: '12/06/2021'
    },
    {
      id: '2',
      type: 'negative',
      title: 'Hamburgeria Pizzy',
      amount: 'R$ 59,00',
      category: {
        name: 'Alimentação',
        icon: 'coffee'
      },
      date: '12/06/2021'
    },
    {
      id: '3',
      type: 'negative',
      title: 'Aluguel do apertamento',
      amount: 'R$ 1.390,00',
      category: {
        name: 'Casa',
        icon: 'shopping-bag'
      },
      date: '12/06/2021'
    },
  ]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo 
              source={{ uri: 'https://avatars.githubusercontent.com/u/6026604?v=4' }}
            />

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Wederson</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
    
      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.390,00"
          lastTransaction="Última entrada dia 13 de agosto"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.000,00"
          lastTransaction="Última saída dia 13 de agosto"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.390,00"
          lastTransaction="01 à 16 de agosto"
        />
      </HighlightCards>
   
      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
        
      </Transactions>
    </Container>
  )
}
