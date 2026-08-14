import Carousel from '../components/topicsCarousel'
import StrictnessToggle from '../components/strictnessToggle'

const Filters = () => {
  return (
    <div className='flex flex-col h-screen'>

         <StrictnessToggle />
      <Carousel />
    </div>
  )
}

export default Filters