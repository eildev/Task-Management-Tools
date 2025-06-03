import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@inertiajs/react";

const SelectSearch = ({
    options = [],
    name,
    label,
    placeholder = "Search...",
    onChange,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const { data, setData } = useForm({ [name]: "" });
    const dropdownRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle option selection
    const handleSelect = (option) => {
        setSelectedOption(option);
        setData(name, option.value);
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mb-3">
            {label && <label className="form-label fw-semibold">{label}</label>}
            <div className="position-relative" ref={dropdownRef}>
                <div
                    className="form-control d-flex align-items-center justify-content-between"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                >
                    <span>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
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
                                        key={option.value}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelect(option)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {option.label}
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

export default SelectSearch;
