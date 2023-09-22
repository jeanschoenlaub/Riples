import React from 'react';
import Select, { ActionMeta } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

// Define ValueType - Either an OptionType or an array of OptionType
type ValueType = OptionType[];

interface MultiSelectProps {
  options: OptionType[];
  onChange: (selected: ValueType | null) => void;
  maxSelection?: number;
  placeholder?: string;
  value?: ValueType;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  maxSelection = 5,
  placeholder = "Select...",
  value,
}) => {
  // Handle change and enforce max selection limit
  const handleChange = (selectedOptions: ValueType, actionMeta: ActionMeta<OptionType>) => {
    let mutableOptions: OptionType[] = Array.isArray(selectedOptions) ? [...selectedOptions] : [];

    if (maxSelection && mutableOptions.length > maxSelection) {
        // Limit the tags to maxSelection
        mutableOptions = mutableOptions.slice(0, maxSelection);
    }
    
    onChange(mutableOptions);
};

  return (
    <Select
      isMulti
      options={options}
      onChange={handleChange as any}  // Using "as any" here to bypass potential type issues.
      placeholder={placeholder}
      value={value}
    />
  );
};

export default MultiSelect;
