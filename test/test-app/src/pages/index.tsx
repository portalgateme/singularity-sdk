import { NextPage } from 'next'
import Head from 'next/head'
import { Deposit } from '../components/Card'
import Layout from '../components/Layout'
import { TabConfig, TabPanel } from '../components/Panel/TabPanel'


const DepositPage: NextPage = () => {

  const tabComponents: TabConfig = {
    deposit: { element: <Deposit />, tabTitle: 'Deposit' },
  }

  return (
    <div>
      <Head>
        <title>Deposit</title>
      </Head>
        <Layout title='Deposit'>
          <TabPanel tabComponents={tabComponents} defaultTab='deposit' />
        </Layout>
    </div>
  )
}

export default DepositPage
