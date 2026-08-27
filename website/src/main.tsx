import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Homepage from './homepage.tsx';
import Privacy_Policy from './pages/privacy_policy.tsx';
import Terms_Of_Services from './pages/terms-of-services.tsx';
import Refund_Policy from './pages/refund_policy.tsx';
import Contact from './pages/contact.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/privacy_policy",
    element: <Privacy_Policy />,
  },
  {
    path:"/terms_of_services",
    element:<Terms_Of_Services/>
  },
  {
    path:"refund_policy",
    element:<Refund_Policy/>
  },
  {
    path:"contact",
    element:<Contact/>
  }
]);

// 2. Pass the router config to the RouterProvider
createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);