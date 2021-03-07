import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import SummaryTable, { SummaryTableProps } from '../components/SummaryTable'

type HomeProps = {
  table: SummaryTableProps
}

export const getStaticProps = async() => {
  const data: HomeProps = {
    table: {
      rows: [
        {
          base: 'BTC',
          quote: 'AUD',
          exchange: 'btcmarkets',
          price: 50000,
          breakeven: 20000,
          prices: [1, 2, 1000, 10000, 60000, 50000],
          dates: ['January', 'February', 'March', 'April', 'May', 'June']
        },
        {
          base: 'PERL',
          quote: 'BTC',
          exchange: 'binance',
          price: 0.00001234,
          breakeven: 0.00002345,
          prices: [0.00000123, 0.00000567, 0.00001234, 0.00002345, 0.00003456, 0.00001234],
          dates: ['January', 'February', 'March', 'April', 'May', 'June']
        }
      ]
    }
  }

  return {
    props: {
      data
    }
  }
}

const Home = ({ data }: { data: HomeProps }) => {
  return (
    <Layout>
      <SummaryTable
        rows={data.table.rows}
      />
    </Layout>
  )
}

export default Home

