import React from 'react';

const SearchInput = ({ searchQuery, handleSearchInput, clearFilters }) => {
    return (
        <div className="nav-item d-flex align-items-center">
            <i className="bx bx-search fs-4 lh-0 text-indigo-500"></i>
            <input
                type="text"
                className="form-control border-0 shadow-none ps-1 ps-sm-2"
                name="q"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInput}
            />
        </div>
    );
};

export default SearchInput;
