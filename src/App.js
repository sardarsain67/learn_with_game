import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar1 from "./components/Navbar1";
import Navbar2 from "./components/Navbar2";
import LoginRegister from "./components/LoginRegister";
import Main from "./components/Main";
import Profile from "./components/Profile";
import LeaderBoard from "./components/LeaderBoard";
import Learn from "./components/Learn";
import Module1 from "./components/Module1";
import Module2 from "./components/Module2";
import Module3 from "./components/Module3";
import Test from "./components/Test";
import Admin from "./components/Admin";
import AdminHome from "./components/AdminHome";
import Questions from "./components/Questions";
import Course from "./components/Course";
import CourseList from "./components/CourseList";
import Navbar3 from "./components/Navbar3";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  let location = useLocation();
  let navbarComponent;

  if (location.pathname === "/" || location.pathname === "/login") {
    navbarComponent = <Navbar1 />;
  } else if (
    location.pathname === "/profile" ||
    location.pathname === "/main" ||
    location.pathname === "/leaderBoard" ||
    //location.pathname === "/learn" ||
    location.pathname.startsWith("/learn") || // Check if the path starts with "/learn"
    location.pathname === "/test" ||
    location.pathname === "/module1" ||
    location.pathname === "/module2" ||
    location.pathname === "/module3"
  ) {
    navbarComponent = <Navbar2 />;
  } else if (
    
    location.pathname === "/question" ||
    location.pathname === "/course" ||
    location.pathname === "/adminhome" ||
    location.pathname === "/courselist"
  ) {
    navbarComponent = <Navbar3 />;
  }
  return (
    <>
      {navbarComponent}
      <div>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<LoginRegister />}></Route>
          <Route exact path="/main" element={<Main />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
          <Route exact path="/leaderBoard" element={<LeaderBoard />}></Route>
          {/*<Route exact path="/learn" element={<Learn />}></Route>*/}
          <Route path="/learn/:courseId" element={<Learn />} />
          <Route exact path="/test" element={<Test />}></Route>
          <Route exact path="/module1" element={<Module1 />}></Route>
          <Route exact path="/module2" element={<Module2 />}></Route>
          <Route exact path="/module3" element={<Module3 />}></Route>
          <Route exact path="/admin" element={<Admin />}></Route>
          <Route exact path="/adminhome" element={<AdminHome />}></Route>
          <Route exact path="/question" element={<Questions />}></Route>
          <Route exact path="/course" element={<Course />}></Route>
          <Route exact path="/courselist" element={<CourseList />}></Route>
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
