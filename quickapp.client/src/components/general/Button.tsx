interface IProps {
    variant: 'primary' | 'secondary' | 'danger' | 'light' ;
    type: 'submit' | 'button' ;
    label: string;
    onClick?: () => void;
    loading? : boolean;
    disabled? : boolean;

}


const Button = ({variant, type ,label, onClick, loading, disabled}:IProps) => {

    const primaryClasses = 'text-white bg-[#4A90E2] border-[#4A90E2] hover:shadow-[0_0_5px_5px_#4A90E24c]'; // A softer blue

    const secondaryClasses = 'text-white bg-[#DBB8B7] border-[#50E3C2] hover:shadow-[0_0_5px_5px_#50E3C270]'; // A calm teal
    
    const dangerClasses = 'text-white bg-[#D0021B] border-[#D0021B] hover:shadow-[0_0_5px_5px_#D0021B70]'; // A strong red
    
    const lightClasses = 'text-[#4A90E2] bg-transparent border-[#D6D5DA] shadow-[0_0_5px_5px_#4A90E24c] hover:shadow-[0_0_5px_5px_#50E3C270]'; // Light blue for text and border

    const classNameCreator = (): string => {
        let finalClassName = 
          'flex justify-center items-center outline-none duration-300 h-14 text-lg font-semibold px-6 rounded-3xl border-2';
        if (variant === 'primary') {
          finalClassName += primaryClasses;
          } else if (variant === 'secondary') {
            finalClassName += secondaryClasses;
          } else if (variant === 'danger') {
            finalClassName += dangerClasses;
          } else if (variant === 'light') {
            finalClassName += lightClasses;
          }
          finalClassName += ' disabled:shadow-none disabled:bg-gray-200 disabled:border-gray-200';
        return finalClassName;
      };

      const loadingIconCreator = () => {
        return <div className='w-4 h-4 rounded-full animate-spin border-2 border-gray-300 border-t-[#4A90E2]'></div>;
      };
      
  return <button type ={type} onClick={onClick} className= {classNameCreator()} disabled={disabled}>
    {loading ? loadingIconCreator()  : label}
    </button>;
}

export default Button