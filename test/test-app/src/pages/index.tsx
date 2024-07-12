import { NextPage } from 'next'
import Head from 'next/head'
import { DemoCard } from '../components/Card/DemoCard'
import Layout from '../components/Layout'
import { TabConfig, TabPanel } from '../components/Panel/TabPanel'


const DemoPage: NextPage = () => {

  const tabComponents: TabConfig = {
    DemoCard: { element: <DemoCard />, tabTitle: 'Demo Wrap ETH' },
  }

  return (
    <div>
      <Head>
        <title>DemoCard</title>
      </Head>
        <Layout title='DemoCard'>
          <TabPanel tabComponents={tabComponents} defaultTab='DemoCard' />
        </Layout>
    </div>
  )
}

export default DemoPage
