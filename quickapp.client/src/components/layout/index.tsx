import useAuth from "../../hooks/useAuth.hooks";
// import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";


const Layout = () => {
    const { isAuthenticated } = useAuth();
    const { pathname } = useLocation();

    console.log(pathname);

    const sideBarRenderer = () => {
        if (isAuthenticated && pathname.toLowerCase().startsWith('/dashboard')) {
            return <Sidebar />;
        }
        return null;
    };
   
  return (
  
    <div className="flex tst">
      {sideBarRenderer()}
      <div className="w-full test">
      <Outlet/>
      </div>
    </div>
  );
}; 

export default Layout