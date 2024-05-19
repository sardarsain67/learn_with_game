import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar1 from "./components/Navbar1";
import Navbar2 from "./components/Navbar2";
import LoginRegister from "./components/LoginRegister";

function App() {
  let location = useLocation();
  let navbarComponent;
  if (location.pathname === "/") {
    console.log(location.pathname);
    navbarComponent = <Navbar1 />;
  } else if (location.pathname === "/login") {
    navbarComponent = <Navbar2 />;
  }
  return (
    <>
      {/* <Navbar1 /> */}
      {navbarComponent}
      <div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route> */}
          <Route path="/login" element={<LoginRegister />}></Route>
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
