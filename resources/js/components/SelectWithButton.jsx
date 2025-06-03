import { Icon } from "@iconify/react";
import SelectSearch from "./SelectSearch";

const SelectWithButton = ({
    options = [],
    name,
    label,
    placeholder = "Search...",
    onChange,
    handleAddTaskGroup,
    buttonValue,
}) => {
    return (
        <div className="row gx-1">
            <div className="col-md-10">
                <SelectSearch
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    options={options}
                    onChange={onChange}
                />
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-center mt-2">
                <button
                    type="button"
                    className="btn btn-outline-info-600 radius-4 p-10 w-40-px h-40-px d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleAddTaskGroup(buttonValue)}
                >
                    <Icon icon="mynaui:plus" className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default SelectWithButton;
