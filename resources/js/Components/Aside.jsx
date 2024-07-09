import React from 'react';
import { Link } from '@inertiajs/react';
import CategoriesNavigation from './CategoriesNavigation';

const Aside = ({ categoryHierarchy, openCategories, toggleAccordion, visibleLevels, imageLogo, imageAside }) => {
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical relative bg-menu-theme">
            <div className="decorative absolute bottom-0 left-0 right-0 top-[70%]">
                <img src={imageAside} alt className="h-auto w-full" />
            </div>
            <div className="app-brand demo">
                <a href="/" className="app-brand-link">
                    <span className="app-brand-logo demo shadow-2xl h-[72px] w-[72px] absolute top-[2px]" style={{ boxShadow: "5px 5px 5px 0px rgba(0,0,0,0.75)", borderRadius: "50%" }}>
                        <img src={imageLogo} alt className="h-full w-full rounded-circle shadow-2xl" />
                    </span>
                    <p className="app-brand-text demo menu-text fw-bold ml-[80px]">Write<span style={{ color: "rgb(113, 221, 55)", fontSize: "3rem" }}>R</span></p>
                </a>
                <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>
            <ul className="menu-inner py-1">
                <li className="menu-item active open">
                    <Link href="/articles" className="menu-link menu-toggle">
                        <i className="menu-icon tf-icons bx bx-home-circle"></i>
                        <div data-i18n="Dashboards">All</div>
                        <div className="badge bg-danger rounded-pill ms-auto">5</div>
                    </Link>
                    <CategoriesNavigation
                        categoryHierarchy={categoryHierarchy}
                        openCategories={openCategories}
                        toggleAccordion={toggleAccordion}
                        visibleLevels={visibleLevels}
                    />
                </li>
            </ul>
        </aside>
    );
};

export default Aside;