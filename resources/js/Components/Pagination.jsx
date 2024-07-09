import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    const getPages = () => {
        let pages = [];
        if (currentPage > 1) {
            pages.push(currentPage - 1);
        }
        pages.push(currentPage);
        if (currentPage < totalPages) {
            pages.push(currentPage + 1);
        }
        return pages;
    };

    const pages = getPages();

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
                {pages.map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(page)}>
                            {page}
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
