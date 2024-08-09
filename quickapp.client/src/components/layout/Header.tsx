import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hooks";
// import { AiOutlineHome } from "react-icons/ai";
import Button from "../general/Button";
import { PATH_DASHBOARD } from "../../routes/paths";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    // <div className="flex justify-between items-center h-12 px-4 bg-gray-100 shadow-md">
    //   <div className="flex items-center gap-4">
    //     {/* <AiOutlineHome 
    //       className="w-8 h-8 text-[#4A90E2] hover:text-[#3a7bcc] cursor-pointer"
    //       onClick={() => navigate("/")}
    //     /> */}
    //   </div>

      <div>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Button
             label="Dashboard"
             type="button"
             onClick={() => navigate(PATH_DASHBOARD.dashboard)}
             variant="primary"
            />
            
            <Button 
             label='Logout' 
             onClick={logout} 
             type='button' 
             variant='secondary' 
            />
          </div>
        )}
      </div>
    // </div>
  );
};

export default Header;
