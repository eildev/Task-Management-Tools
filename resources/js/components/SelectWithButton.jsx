import { Icon } from "@iconify/react";
import SelectSearch from "./SelectSearch";
import PropTypes from "prop-types";

const SelectWithButton = ({
    options = [],
    name,
    label,
    placeholder = "Search...",
    onChange,
    handleAddTaskGroup,
    buttonValue,
    labelKey = "label",
    valueKey = "value",
    renderOption,
    setFormData,
    formData,
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
                    labelKey={labelKey}
                    valueKey={valueKey}
                    renderOption={renderOption}
                    setFormData={setFormData}
                    formData={formData}
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

SelectWithButton.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    handleAddTaskGroup: PropTypes.func.isRequired,
    buttonValue: PropTypes.string.isRequired,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    renderOption: PropTypes.func,
    setFormData: PropTypes.func,
    formData: PropTypes.object,
};

SelectWithButton.defaultProps = {
    options: [],
    placeholder: "Search...",
};

export default SelectWithButton;


// import { Icon } from "@iconify/react";
// import SelectSearch from "./SelectSearch";

// const SelectWithButton = ({
//     options = [],
//     name,
//     label,
//     placeholder = "Search...",
//     onChange,
//     handleAddTaskGroup,
//     buttonValue,
// }) => {
//     return (
//         <div className="row gx-1">
//             <div className="col-md-10">
//                 <SelectSearch
//                     name={name}
//                     label={label}
//                     placeholder={placeholder}
//                     options={options}
//                     onChange={onChange}
//                 />
//             </div>
//             <div className="col-md-2 d-flex align-items-center justify-content-center mt-2">
//                 <button
//                     type="button"
//                     className="btn btn-outline-info-600 radius-4 p-10 w-40-px h-40-px d-flex align-items-center justify-content-center gap-2"
//                     onClick={() => {
//                         console.log("Button clicked, value:", buttonValue);
//                         handleAddTaskGroup(buttonValue);
//                     }}
//                 >
//                     <Icon icon="mynaui:plus" className="text-xl" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SelectWithButton;
