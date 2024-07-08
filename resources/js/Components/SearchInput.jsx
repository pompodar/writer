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
            {searchQuery && (
                <span className="text-muted fw-light cursor-pointer ml-auto" onClick={clearFilters}>
                    clear filters
                </span>
            )}
        </div>
    );
};

export default SearchInput;
