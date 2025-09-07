import { Dropdown } from 'primereact/dropdown';
import { ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useState } from 'react';

const StatusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    const [statuses] = useState([
        'active',
        'inactive',
        'blocked'
    ]);
    
    const handleFilterChange = (value: string | null) => {
        console.log('Status Filter Value:', value);
        options.filterCallback(value);
    };

    return (
        <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => handleFilterChange(e.value)}
            placeholder="Select Status"
            className="w-full"
            showClear
        />
    );
};

export default StatusFilterTemplate;
