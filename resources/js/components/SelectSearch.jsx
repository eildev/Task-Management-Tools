import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const SelectSearch = ({
    options = [],
    name,
    label,
    placeholder = "Search...",
    onChange,
    labelKey = "label",
    valueKey = "value",
    renderOption,
    setFormData,
    formData,
    isRequired,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    // Initialize selected option based on formData
    useEffect(() => {
        if (formData && formData[name]) {
            const selected = options.find(
                (option) => option[valueKey] === formData[name]
            );
            setSelectedOption(selected || null);
        } else {
            setSelectedOption(null);
        }
    }, [formData, name, options, valueKey]);

    // Filter options based on search term
    const filteredOptions = options.filter((option) => {
        const label = option[labelKey] ?? option.name ?? "";
        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Handle option selection
    const handleSelect = (option) => {
        setSelectedOption(option);
        const value = option[valueKey] ?? option.id;
        if (setFormData && formData) {
            setFormData(name, value); // Use the passed setFormData function
        }
        setIsOpen(false);
        setSearchTerm("");
        if (onChange) onChange(option);
    };

    // Handle search input change
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Find selected option for display
    const selectedLabel = selectedOption
        ? selectedOption[labelKey] ?? selectedOption.name ?? placeholder
        : placeholder;

    return (
        <div className="mb-3">
            {label && (
                <label className="form-label fw-semibold">
                    {label}{" "}
                    {isRequired ? (
                        <span className="text-danger"> *</span>
                    ) : null}
                </label>
            )}
            <div className="position-relative" ref={dropdownRef}>
                <div
                    className="form-control d-flex align-items-center justify-content-between"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                >
                    <span>{selectedLabel}</span>
                    <Icon
                        icon={isOpen ? "bi:chevron-up" : "bi:chevron-down"}
                        className="ms-2"
                    />
                </div>
                {isOpen && (
                    <div
                        className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm"
                        style={{
                            zIndex: 1000,
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        <div className="p-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                autoFocus
                            />
                        </div>
                        <ul className="list-group">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <li
                                        key={option[valueKey] ?? option.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelect(option)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {renderOption
                                            ? renderOption(option)
                                            : option[labelKey] ??
                                              option.name ??
                                              "No label"}
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item text-muted">
                                    No results found
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

SelectSearch.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    renderOption: PropTypes.func,
    setFormData: PropTypes.func,
    formData: PropTypes.object,
    isRequired: PropTypes.bool,
};

SelectSearch.defaultProps = {
    options: [],
    placeholder: "Search...",
    labelKey: "label",
    valueKey: "value",
};

export default SelectSearch;
