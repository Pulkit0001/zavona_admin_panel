// import { CustomDropdown } from "ui-components";
// import { tableFilters } from "../../data/constants";
import CustomDropdown from "./CustomDropdown";

const CreateTableDropdownFilters = (
  options: any,
  statuses: string[],
  defaultSingleValue: any = null,
//   matchMode: any = tableFilters.IN,
  filter:boolean = false,
  optionLabel?:string,
  iconsList: boolean = false,
  placeholder?: string,
) => {
  
  return (
    <CustomDropdown
      onChange={(e: any) => {
        if(!iconsList){
          options?.filterApplyCallback(e);
        }else{
          const selectedOptions = e.map((item:any) => item.id );
          options?.filterApplyCallback(selectedOptions)
        }
    }}
      options={statuses}
      optionLabel={optionLabel}
      placeholder={placeholder ? placeholder : "Select status"}
      className="p-column-filter teamTableSelector"
      maxSelectedLabels={1}
      borderLess={true}
      multiSelect={statuses?.length > 1}
      disabled={statuses?.length === 1}
      selectedOption={statuses?.length === 1 && statuses}
      readOnly={true}
      containerClassName="!bg-transparent !min-w-0 !max-w-[150px]"
      filter={filter}
      inputClassName="text-neutral-600 font-normal text-xs"
      defaultSingleValue={defaultSingleValue}
    />
  );
};

export default CreateTableDropdownFilters;
