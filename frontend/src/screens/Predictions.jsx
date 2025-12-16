import Footer from '../components/Footer'
import Header from '../components/Header'
import Leaderboard from '../components/Leaderboard'
import PredictionSection from '../components/PredictionSection'
import Sidebar from '../components/Sidebar'

const Predictions = () => {
  return (
    <div className='grid grid-rows-[min-content_1fr_min-content] h-screen'>
      <Header />
      <div className='px-4 grid grid-flow-col'>
        <Sidebar />
        <PredictionSection />
        <Leaderboard />
      </div>
      <Footer />
    </div>
  )
}

export default Predictions
