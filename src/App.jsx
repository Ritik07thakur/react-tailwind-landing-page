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
import DashboardForm from "./components/DashboardForm";
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
          <Route path="/dashboard" element={<Dashboard/>}/>
          {/* <Route path="/addUser" element={<DashboardForm/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
