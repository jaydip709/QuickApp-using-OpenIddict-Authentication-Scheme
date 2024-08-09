import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.hooks";
import { useNavigate } from "react-router-dom";
import { RolesEnum } from "../../types/auth.types";
import Button from "../general/Button";
import { PATH_DASHBOARD } from "../../routes/paths";
import { FaArrowLeft } from "react-icons/fa6";
import { FaUser } from 'react-icons/fa';
import { IoDocumentText } from "react-icons/io5";
import { FaUserCog } from 'react-icons/fa';
import { FaUsers } from "react-icons/fa6";
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from  "../../assets/img/5 - Copy.jpg";


const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { user,logout } = useAuth();
  const userinfo :any = localStorage.getItem("user");
  const userdata = JSON.parse(userinfo);

  const [visibleButtons, setVisibleButtons] = useState({
    usersManagement: false,
    allLogs: false,
  });
  const navigate = useNavigate();

  const handleClick = (url: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    navigate(url);
  };

 () => {
    if (user) {
      let result = '';
      user.roles.forEach((role, index) => {
        result += role;
        if (index < user.roles.length - 1) {
          result += ', ';
        }
      });
      return result;
    }
    return '--';
  };

  useEffect(() => {
    if (userdata) {
      const roles = userdata.role;
      setVisibleButtons({
        usersManagement: roles.includes(RolesEnum.OWNER) || roles.includes(RolesEnum.MANAGER) || roles.includes(RolesEnum.ADMIN),
        allLogs: roles.includes(RolesEnum.OWNER) || roles.includes(RolesEnum.ADMIN),
      
      });
    }
  }, [user]);

  return (
   
      <div className={` tst p-5 pt-8 transition-all duration-300 
        ${open ? "w-72 " : "w-12" } relative `}  style={{backgroundImage : `url(${backgroundImage})`}}>
        <FaArrowLeft
          className={`bg-blue text-dark-purple text-3xl rounded-full absolute -right-3 top-9 border border-dark-purple cursor-pointer 
            ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        {open ? 
          <>
          <div className="flex flex-col items-center mt-0">
              <FaUser className='text-6xl mb-2' /> 
              <h3 className='text-black '>
                {userdata.firstname}&nbsp;{userdata.lastname}
              </h3>
          </div>
           
            <h4 className="text-black d-flex justify-center p-1">
              <span className="text-black">UserName:</span>
              {/* <span className="ml-2">{userdata.userName}</span> */}
              <span className="ml-2">{userdata ? userdata.name : '--'}</span>
            </h4>
            <h4 className="text-black text-center p-1 flex justify-center items-center">
                <span className="text-black">UserRoles:</span>
                <span className="ml-2">{userdata.role}</span>
            </h4>
            <hr/>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col gap-3 mt-1">
                  <Button
                  label="Dashboard"
                  type="button"
                  onClick={() => navigate(PATH_DASHBOARD.dashboard)}
                  variant="secondary"
                  />
              </div>   
              {visibleButtons.usersManagement &&(
              <div className="flex mt-2 gap-6 firsttest">
                
                  <Button
                    label='Users Management'
                    onClick={() => handleClick(PATH_DASHBOARD.usersManagement)}
                    type='button'
                    variant='secondary'
                   
                  />
              </div>
                )}
                {visibleButtons.allLogs && (
              <div className="flex flex-col gap-3 mt-1">
                  <Button
                    label='All Logs'
                    onClick={() => handleClick(PATH_DASHBOARD.systemLogs)}
                    type='button'
                    variant='secondary'
                    />
              </div>
                  )}
              <div className="flex flex-col gap-3 mt-1">
                <Button
                  label='My Logs'
                  onClick={() => handleClick(PATH_DASHBOARD.myLogs)}
                  type='button'
                  variant='secondary'
                />
              </div>
              
              <div className="flex flex-col gap-3 mt-1"> 
                    <Button 
                    label='Logout' 
                    onClick={logout} 
                    type='button' 
                    variant='secondary' 
                    />
              </div>
            </div>
          </> : 
          <>
      
          <div className="flex flex-col items-center mt-8">
          <FaUser className='text-5xl mb-2' /> 
          <hr className="w-16 border-t mt-2" />
          </div>
        

          <div className="flex flex-col items-center mt-4">
            <FontAwesomeIcon icon={faTachometerAlt} className="text-4xl mb-2 mt-2" 
            onClick={() => navigate(PATH_DASHBOARD.dashboard)}
            />
          </div>
          {visibleButtons.usersManagement &&(
          <div className="flex flex-col items-center mt-4">
            <FaUsers className='text-4xl mb-2 mt-2'
             onClick={() => handleClick(PATH_DASHBOARD.usersManagement)}/>
          </div>)}

          {visibleButtons.allLogs && (
          <div className="flex flex-col items-center mt-4">
            <FaUserCog className='text-4xl mb-2 mt-2' 
            onClick={() => handleClick(PATH_DASHBOARD.systemLogs)}/>
          </div>)}

          <div className="flex flex-col items-center mt-4">
            <IoDocumentText  className="text-4xl mb-2 mt-2"  
            onClick={() => handleClick(PATH_DASHBOARD.myLogs)} />
          </div>
          
          <div className="flex flex-col items-center mt-4">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-4xl mb-2 mt-2" 
              onClick={logout} />
          </div>
   
          </>
        }
      </div>
      
      
  );
};

export default Sidebar;

