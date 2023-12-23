import React, { useState, useMemo } from 'react';
import { MultiSelect, OptionType } from '~/components/multi-select';
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
        const statusValues = selectedOptions?.map(option => option.value) || [];
        setSelectedStatuses(selectedOptions || []);
        applyFilters(statusValues, selectedDates);
    };

    const handleDateChange = (dates: Date[] | null) => {
        setSelectedDates(dates || [new Date(), new Date()]);
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
        <div className="filter-bar">
            <label htmlFor="task-status-filter">Filter by Status:</label>
            <MultiSelect
                options={statusOptions}
                value={selectedStatuses}
                onChange={handleStatusChange}
                placeholder="Select statuses..."
            />
            <div id="task-modal-due-date" className="flex items-center space-x-5 mb-2 flex-nowrap">
                <span className="text-base flex flex-shrink items-center space-x-4 w-auto" aria-label="Task Title">
                    <div className='flex-shrink-0'>Due date:</div>
                    <RangeDatepicker
                        selectedDates={selectedDates}
                        onDateChange={handleDateChange}
                        propsConfigs={{
                            popoverCompProps: {
                                popoverBodyProps: {
                                    fontSize: "xs",
                                },
                            },
                        }}
                    />
                </span>
            </div>
        </div>
    );
};

export default TaskFilter;
