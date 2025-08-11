import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  About,
  Blogs,
  Footer,
  Hero,
  Logos,
  Navbar,
  Pricing,
} from "./components";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
// import DashboardForm from "./components/DashboardForm";
import Forget from "./pages/Forget";
import QueueBoard from "./components/QueueBoard";
// import Forgett from "./pages/Forgett";
// import PendingOrders from "./pages/PendingOrders";
// import OrderList from "./components/OrderList";
// import ChangeOrderStatus from "./components/ChangeOrderStatus";
// import LinkedInAuth from "./components/LinkedInAuth";
// import FacebookAuth from "./components/FacebookAuth";
// import Loginn from "./pages/Loginn";

function App() {
  return (
    <div className="h-full bg-slate-100 dark:bg-slate-900">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Logos />
                <About />
                <Pricing />
                <Blogs />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/loginn" element={<Loginn />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/dashboard/pendingOrder" element={<ChangeOrderStatus />} /> */}
          {/* <Route path="/dashboard/Order" element={<OrderList />} /> */}
          <Route path="/forget" element={<Forget />} />
          <Route path="/queueBoard" element={<QueueBoard/>} />
          {/* <Route path="/forgett" element={<Forgett />} /> */}
          {/* <Route path="/linkedin-auth" element={<LinkedInAuth />} /> */}
          {/* <Route path="/facebook" element={<FacebookAuth />} /> */}
          {/* <Route path="/addUser" element={<DashboardForm/>}/> */}
          
        </Routes>
      </Router>
    </div>
  );
}
export default App;

// put = http://localhost:5000/api/user/order/:id
// get = http://localhost:5000/api/user/showOrder
// post = http://localhost:5000/api/user/orderPlace