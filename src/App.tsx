import { Toaster } from 'react-hot-toast';
import './App.css';
import Popup from './popup/popup';

function App() {
  return (
    <div className="flex min-h-screen bg-transparent items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_32%),linear-gradient(135deg,#F7F8FC_0%,#FBFCFF_100%)] p-1">
      <Toaster />
      <Popup />
    </div>
  );
}

export default App;
