import { Calendar } from 'primereact/calendar';
import type { ColumnFilterElementTemplateOptions } from 'primereact/column';

const DateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
        <Calendar
            value={options.value}
            onChange={(e) => {
                if (e.value) {
                    // Convert to start of day for consistent comparison
                    const date = new Date(e.value);
                    date.setHours(0, 0, 0, 0);
                    options.filterCallback(date.toISOString());
                } else {
                    options.filterCallback(null);
                }
            }}
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            className="w-full"
            showTime={false}
        />
    );
};

export default DateFilterTemplate;
