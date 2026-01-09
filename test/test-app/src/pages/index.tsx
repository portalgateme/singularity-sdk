import { NextPage } from 'next'
import Head from 'next/head'
import { DemoSwapMakerCard } from '../components/Card/SwapMaker'
import { DemoSwapMakerFinalCard } from '../components/Card/SwapMakerFinal'
import { DemoSwapTakerCard } from '../components/Card/SwapTaker'
import { DemoSwapTakerWithdrawCard } from '../components/Card/SwapTakerWithdraw'
import Layout from '../components/Layout'
import { TabConfig, TabPanel } from '../components/Panel/TabPanel'
import { DemoAerodromeSwapCard } from '../components/Card/AerodromeSwap'
import { DemoAerodromeAddLpCard } from '../components/Card/AerodromeAddLP'


const DemoPage: NextPage = () => {

  const tabComponents: TabConfig = {
    DemoSwapMakerCard: { element: <DemoSwapMakerCard />, tabTitle: '1.Maker' },
    DemoSwapTakerCard: { element: <DemoSwapTakerCard />, tabTitle: '2.Taker' },
    DemoSwapMakerFinalCard: { element: <DemoSwapMakerFinalCard />, tabTitle: '3.Maker Swap' },
    DemoSwapTakerWithdrawCard: { element: <DemoSwapTakerWithdrawCard />, tabTitle: '4.Taker Withdraw' },
    //DemoAerodromeSwapCard: { element: <DemoAerodromeSwapCard />, tabTitle: '5.Aerodrome Swap' },
    //DemoAerodromeAddLpCard: { element: <DemoAerodromeAddLpCard />, tabTitle: '6.Aerodrome Add LP' },
    // DemoCard: { element: <DemoCard />, tabTitle: 'Demo Infra' },
    // DemoStakeCard: { element: <DemoStakeCard />, tabTitle: 'Stake' },
  }

  return (
    <div>
      <Head>
        <title>DemoCard</title>
      </Head>
        <Layout title='DemoCard'>
          <TabPanel tabComponents={tabComponents} defaultTab='DemoSwapMakerCard' />
        </Layout>
    </div>
  )
}

export default DemoPage
