import Footer from '../components/Footer'
import Header from '../components/Header'
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import Leaderboard from '../components/Leaderboard'
import PredictionSection from '../components/PredictionSection'
import Sidebar from '../components/Sidebar'

const Predictions = () => {
  return (
    <div className='grid grid-rows-[min-content_1fr_min-content] h-screen'>
      <Header />
      <div className='px-4 grid grid-flow-col'>
        {/*<Sidebar />*/}
        <main className={`flex-1 bg-gray-100 pb-2 md:pt-2 px-4`}>
          <Outlet />
        </main>
      </div>
      <Footer /> 
    </div>
  )
}

export default Predictions
