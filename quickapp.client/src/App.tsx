// import React from 'react'

import { Toaster } from "react-hot-toast"
import GlobalRouter from "./routes"


const App = () => {
  return (
    <>
        <GlobalRouter/>
        <Toaster/>
    </>
  );
};

export default App