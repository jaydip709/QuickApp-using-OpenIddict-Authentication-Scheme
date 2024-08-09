import { ImSpinner } from "react-icons/im";

const AuthSpinner = () => {
  return (
    <div className="w-50 h-50 mx-auto flex justify-center items-center">
      <ImSpinner className="w-40 h-40 text-blue animate-spin" />
    </div>
  );
};

export default AuthSpinner;
