import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Homepage from './homepage.tsx';
import Privacy_Policy from './pages/privacy_policy.tsx';
import Terms_Of_Services from './pages/terms-of-services.tsx';
import Refund_Policy from './pages/refund_policy.tsx';
import Contact from './pages/contact.tsx';
import PaymentSuccess from './pages/payment-success.tsx';
import PaymentFailed from './pages/payment-failed.tsx';
import AfterDownload from './pages/afterDownload.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/privacy-policy",
    element: <Privacy_Policy />,
  },
  {
    path:"/terms-of-services",
    element:<Terms_Of_Services/>
  },
  {
    path:"refund-policy",
    element:<Refund_Policy/>
  },
  {
    path:"contact",
    element:<Contact/>
  },
  {
    path:"payment-success",
    element:<PaymentSuccess/>
  },
  {
    path:"afterDownload",
    element:<AfterDownload/>
  },
  {
    path:"payment-failed",
    element:<PaymentFailed/>
  },
]);

// 2. Pass the router config to the RouterProvider
createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);