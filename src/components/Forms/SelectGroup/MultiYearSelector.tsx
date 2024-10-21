import React from 'react';

interface MultiYearSelectorProps {
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
}

const MultiYearSelector: React.FC<MultiYearSelectorProps> = ({ selectedYears, setSelectedYears }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, index) => (currentYear - index).toString());

  const toggleYearSelection = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((selectedYear) => selectedYear !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-center">Selecione os Anos:</h3>
      <div className="flex flex-wrap gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => toggleYearSelection(year)}
            className={`py-2 px-4 border rounded ${
              selectedYears.includes(year) ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiYearSelector;
