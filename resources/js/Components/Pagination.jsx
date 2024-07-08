import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                {/* Previous page link */}
                {currentPage > 1 && (
                    <li className="page-item">
                        <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                )}
                {/* Pages */}
                {[...Array(totalPages).keys()].map((page) => (
                    <li key={page + 1} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(page + 1)}>
                            {page + 1}
                        </button>
                    </li>
                ))}
                {/* Next page link */}
                {currentPage < totalPages && (
                    <li className="page-item">
                        <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
