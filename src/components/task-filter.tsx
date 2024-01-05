import React, { useState, useMemo } from 'react';
import { MultiSelect, type OptionType } from '~/components/multi-select';
import { taskStatus } from "~/utils/constants/dbValuesConstants";
import { RangeDatepicker } from "chakra-dayzed-datepicker";

type TaskFilterProps = {
    onFilterChange: (filters: { selectedStatuses: string[], selectedDates: Date[] | null }) => void;
};

const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
    const [selectedStatuses, setSelectedStatuses] = useState<OptionType[]>([]);

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [selectedDates, setSelectedDates] = useState<Date[]>([oneMonthAgo, oneMonthFromNow]);

    const handleStatusChange = (selectedOptions: OptionType[] | null) => {
        const statusValues = selectedOptions?.map(option => option.value) ?? [];
        setSelectedStatuses(selectedOptions ?? []);
        applyFilters(statusValues, selectedDates);
    };

    const handleDateChange = (dates: Date[] | null) => {
        setSelectedDates(dates ?? [new Date(), new Date()]);
        applyFilters(selectedStatuses.map(option => option.value), dates);
    };

    const applyFilters = useMemo(() => {
        return (statusValues: string[], dates: Date[] | null) => {
            onFilterChange({ selectedStatuses: statusValues, selectedDates: dates });
        };
    }, [onFilterChange]);

    const statusOptions: OptionType[] = taskStatus.map(status => ({
        value: status,
        label: status
    }));

    return (
        <div id="to-do-list-filter-bar" className="p-3 bg-gray-200 rounded-lg shadow-md mb-4">
          <div className="flex justify-between">
            {/* Filter dropdown */}
            <div className="flex flex-grow mr-4 items-center">
                <label htmlFor="filter" className="mr-2 text-gray-600 text-xs md:text-base font-medium">
                   Task Status:
                </label>
                <div className='w-3/4'>
                    <MultiSelect
                        options={statusOptions}
                        value={selectedStatuses}
                        onChange={handleStatusChange}
                        placeholder="Select statuses..."
                    />
                </div> 
            </div>

            {/* Order by dropdown */}
            <div className="flex flex-grow items-center">
              <label htmlFor="order" className="mr-2 flex-shrink-0 text-xs md:text-base  text-gray-600 font-medium">
                Due Date:
              </label>
              <div className='w-3/4 bg-white rounded-lg'>
                    <RangeDatepicker
                        selectedDates={selectedDates}
                        onDateChange={handleDateChange}
                        configs={{
                            dateFormat: 'dd/MM/yy'
                        }}
                        propsConfigs={{
                            popoverCompProps: {
                                popoverBodyProps: {
                                    fontSize: "xs",
                                },
                                popoverContentProps: {
                                  background: "white",
                                  color: "black",
                                },
                              },
                        }}
                    />
                </div>
            </div>
          </div>
        </div>
    );
};

export default TaskFilter;
