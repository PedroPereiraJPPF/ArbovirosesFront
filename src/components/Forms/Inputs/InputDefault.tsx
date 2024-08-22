import React from 'react';

interface InputProps {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputDefault: React.FC<InputProps> = ({
  label,
  placeholder = 'Default Input',
  disabled = false,
  value,
  onChange,
}) => {
  return (
    <div className="mb-3">
      <label className="block text-black dark:text-white pb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputDefault;
