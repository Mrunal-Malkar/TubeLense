import { Toaster } from 'react-hot-toast';
import './App.css';
import Popup from './popup/popup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient=new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_32%),linear-gradient(135deg,#F7F8FC_0%,#FBFCFF_100%)] overflow-hidden">
      <Toaster />
      <Popup />
    </div>
    </QueryClientProvider>
  );
}

export default App;
