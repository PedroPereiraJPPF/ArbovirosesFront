import React, { useState } from 'react';

interface AgravoSelectorProps {
    agravoSelected: string;
    setAgravoSelected: Function;
}

const AgravoSelector: React.FC<AgravoSelectorProps> = ({agravoSelected, setAgravoSelected}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };
  
  return (
    <div className="mb-4.5">
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={agravoSelected}
          onChange={(e) => {
            setAgravoSelected(e.target.value);
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary mr-4 ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
            <option value={'dengue'} className="text-body dark:text-bodydark">
                Dengue
            </option>
            <option value={'zika'} className="text-body dark:text-bodydark">
                Zika
            </option>
            <option value={'chikungunya'} className="text-body dark:text-bodydark">
                Chikungunya
            </option>
        </select>
      </div>
    </div>
  );
};

export default AgravoSelector;
