import React from 'react';
import Select from 'react-select';
import type { ActionMeta } from 'react-select';

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
  type ReadonlyValueType = readonly OptionType[];

  const handleChange = (selectedOptions: ReadonlyValueType | null, actionMeta: ActionMeta<OptionType>) => {
    if (!selectedOptions) {
        onChange(null);
        return;
    }

    let mutableOptions: OptionType[] = [...selectedOptions];

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
      onChange={handleChange}  // Using "as any" here to bypass potential type issues.
      placeholder={placeholder}
      value={value}
    />
  );
};

export default MultiSelect;
