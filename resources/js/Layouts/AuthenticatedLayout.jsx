import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const initialOpenCategories = JSON.parse(localStorage.getItem('openCategories')) || [];

    const initialVisibleLevels = JSON.parse(localStorage.getItem('visibleLevels')) || [0, 1, 2];

    const [openCategories, setOpenCategories] = useState(initialOpenCategories);
    const [categories, setCategories] = useState([]);
    const [renderedCategories, setRenderedCategories] = useState([]);

    const [visibleLevels, setVisibleLevels] = useState(initialVisibleLevels);

    const [categoryHierarchy, setCategoryHierarchy] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/wp-json/custom/v1/categories/`);
            const categories = response.data;
            if (categories.length > 0) {
                console.log(categories);
                setCategories(categories);
                const hierarchy = buildCategoryHierarchy(categories);
                setCategoryHierarchy(hierarchy);
            } else {
                console.log("No categories");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const isChildOfOpenCategory = (categoryId) => {
        let parentId = categoryId;
        while (parentId !== null) {
            const parentCategory = categories.find(cat => cat.id === parentId);
            if (!parentCategory) break;
            if (openCategories.includes(parentCategory.id)) {
                return true;
            }
            parentId = parentCategory.parent_id;
        }
        return false;
    };

    const toggleAccordion = (category) => {
        if (openCategories.includes(category.id)) {
            setOpenCategories(openCategories.filter(id => id !== category.id));
        } else {
            if (isChildOfOpenCategory(category.id)) {
                setOpenCategories([...openCategories, category.id]);
            } else {
                setOpenCategories([category.id]);
            }
        }

        setVisibleLevels([category.level - 1, category.level, category.level + 1]);

        localStorage.setItem('visibleLevels', JSON.stringify([category.level - 1, category.level, category.level + 1]));

        router.visit('/history-articles/', {
            method: 'get',
            data: { category: category.id },
            preserveState: true,
            onCancel: () => {},
            onSuccess: (page) => {},
            onError: (errors) => { console.log(errors); },
            onFinish: visit => {},
        });
    };

    useEffect(() => {
        localStorage.setItem('openCategories', JSON.stringify(openCategories));
    }, [openCategories]);

    const isOpen = (categoryId) => openCategories.includes(categoryId);

    const buildCategoryHierarchy = (categories) => {
        const categoryMap = {};
    
        // Create a map of categories
        categories.forEach((category) => {
            categoryMap[category.id] = { ...category, children: [] };
        });
    
        const hierarchy = [];
    
        // Build the hierarchy
        categories.forEach((category) => {
            if (category.parent_id === null) {
                hierarchy.push(categoryMap[category.id]);
            } else {
                categoryMap[category.parent_id].children.push(categoryMap[category.id]);
            }
        });

        console.log(hierarchy, 'hierarchy');
    
        return hierarchy;
    };
    
    const renderCategories = (categories, currentLevel) => {
        return categories.map((category) => (
            <li style={{ marginLeft: currentLevel * 20 }} className={`level-${currentLevel} menu-item cursor-pointer`} key={category.id}>
                <div className={`menu-link accordion-header ${!visibleLevels.includes(currentLevel) ? 'hidden' : ''}`} onClick={() => toggleAccordion({ id: category.id, name: category.name, level: currentLevel })}>
                    {category.name}
                </div>
                {isOpen(category.id) && category.children && (
                    <ul>
                        {renderCategories(category.children, currentLevel + 1)}
                    </ul>
                )}
            </li>
        ));
    };

    function generateRandomNumber(pictures_number = 13) {
        return Math.floor(Math.random() * pictures_number) + 1;
    } 

    const imageUrl = `/assets/img/elements/${generateRandomNumber()}.jpg`;
    const randomNumber = generateRandomNumber(38);
    const bgUrl = `url(../assets/img/elements-aside/${randomNumber}.jpg)`;

    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container menu">
                    <aside id="layout-menu" className="layout-menu menu-vertical relative bg-menu-theme">
                        <div className="decorative absolute bottom-0 left-0 right-0 top-[70%]" style={{ backgroundImage: bgUrl }}></div>
                        <div className="app-brand demo">
                            <a href="/" className="app-brand-link">
                                <span className="app-brand-logo demo shadow-2xl" style={{ boxShadow: "5px 5px 5px 0px rgba(0,0,0,0.75)", borderRadius: "50%" }}>
                                    <img src={imageUrl} alt className="w-px-40 h-auto rounded-circle shadow-2xl" />
                                </span>
                                <p className="app-brand-text demo menu-text fw-bold ms-2">Write<span style={{ color: "rgb(113, 221, 55)", fontSize: "3rem" }}>R</span></p>
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
                                <ul className="menu-sub">
                                    {renderCategories(categoryHierarchy, 0)}
                                </ul>
                            </li>
                        </ul>
                    </aside>

                    <div className="layout-page bg-white">
                        {children}

                        <footer className="content-footer footer bg-footer-theme">
                            <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                                <div className="mb-2 mb-md-0">
                                    ©
                                    <script>
                                        document.write(new Date().getFullYear());
                                    </script>
                                    , made with ❤️ by
                                    <a href="https://themeselection.com" target="_blank" className="footer-link fw-medium text-indigo-500"> Pompodar</a>
                                </div>
                                <div className="d-none d-lg-inline-block">
                                    <a href="https://themeselection.com/license/" className="footer-link me-4" target="_blank">License</a>
                                    <a href="https://themeselection.com/" target="_blank" className="footer-link me-4">More Themes</a>
                                    <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>
                                    <a href="https://github.com/themeselection/sneat-html-admin-template-free/issues" target="_blank" className="footer-link">Support</a>
                                </div>
                            </div>
                        </footer>

                        <div className="content-backdrop fade"></div>
                    </div>
                </div>
            </div>

            <div className="layout-overlay layout-menu-toggle"></div>
        </>
    );
}
