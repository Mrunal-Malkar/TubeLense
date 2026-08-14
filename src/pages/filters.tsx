import Carousel from '../components/topicsCarousel'
import StrictnessToggle from '../components/strictnessToggle'

const Filters = () => {
  return (
    <div className='flex flex-col h-full p-2 max-w-90'>
<h1 className="text-lg font-semibold text-slate-700 m-0.5 flex items-center gap-2">
  <span className="w-1 h-5 rounded-full bg-indigo-400/70" />
  Packs & their corresponding topics
</h1>
      <Carousel />
         <StrictnessToggle />
    </div>
  )
}

export default Filters