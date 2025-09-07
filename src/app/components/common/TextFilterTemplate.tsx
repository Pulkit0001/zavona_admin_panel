import React from 'react';
import { InputText } from 'primereact/inputtext';

const TextFilterTemplate = (options: any, type: string = "string") => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e?.target?.value;

    newValue = newValue.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');

    const updatedValue = type === "number" && newValue !== "" ? Number(newValue) : newValue;
    options?.filterApplyCallback(updatedValue);
  };

  const isArabic = options?.language === "arabic";

  return (
    <div
      className={`flex items-center h-8 px-2 ${isArabic ? 'flex-row-reverse' : ''}`}
    >
      <i className="pi pi-search text-neutral-600 p-0 m-0" />
      <InputText
        value={options?.value}
        onChange={handleInputChange}
        placeholder="Search"
        className={`border-0 focus:ring-0 text-neutral-600 p-0 m-0 text-xs ${isArabic ? 'placeholder:text-left' : ''}`}
      />
    </div>
  );
};

export default TextFilterTemplate;