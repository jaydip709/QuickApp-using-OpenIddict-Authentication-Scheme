// import React from 'react'
import unauthorizedImage from '../../assets/img/401 Error Unauthorized.png';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
    <img src={unauthorizedImage} alt="Unauthorized" style={{ maxWidth: '50%', height: '50%',marginLeft : '24%'}} />
    
  </div>
  );
};

export default UnauthorizedPage
