// import React from 'react';
import notFoundImage from '../../assets/img/404 error.png'; 

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img src={notFoundImage} alt="Not Found" style={{ maxWidth: '50%', height: '50%',marginLeft : '24%'}} />
      
    </div>
  );
}

export default NotFoundPage;
