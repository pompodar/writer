import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const initialOpenCategories = JSON.parse(localStorage.getItem('openCategories')) || [];

    const [openCategories, setOpenCategories] = useState(initialOpenCategories);


    const [categories, setCategoriess] = useState([]);

    const [level, setLevel] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/categories-menu');
            setCategoriess(response.data.categories);
        };

        fetchData();
    }, []);

    const toggleAccordion = (category) => {
       
        if (openCategories.includes(category.id)) {
            setOpenCategories(openCategories.filter((id) => id !== category.id));
        } else {
            
            setOpenCategories([...openCategories, category.id]);

            
            
        }
        router.visit('/' + category.name.toLowerCase(), {
                method: 'get',
                preserveState: true,
                onCancel: () => { },
                onSuccess: (page) => {

                },
                onError: (errors) => {
                    console.log(errors);
                },
                onFinish: visit => {

                },
            });
    };

    useEffect(() => {
        localStorage.setItem('openCategories', JSON.stringify(openCategories));
    }, [openCategories]);

    const isOpen = (categoryId) => openCategories.includes(categoryId);
    const renderCategories = (categories, currentLevel) => {
        return categories.map((category) => (
            <li style={{marginLeft: currentLevel * 5 }} className={`level-${currentLevel} menu-item cursor-pointer`} key={category.id}>
                <div className="menu-link accordion-header" onClick={() => toggleAccordion({ id: category.id, name: category.name })}>
                    {category.name}
                </div>
                {isOpen(category.id) && category.find_children && renderCategories(category.find_children, currentLevel + 1)}
            </li>
        ));
    };    

    function generateRandomNumber() {
        return Math.floor(Math.random() * 13) + 1;
    }

    const imageUrl = `/assets/img/elements/${generateRandomNumber()}.jpg`;

    return (
        <>
            <div class="layout-wrapper layout-content-navbar">
                <div class="layout-container">

                    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
                        <div class="app-brand demo">
                            <a href="/" class="app-brand-link">
                                <span class="app-brand-logo demo">

                                    <img src={imageUrl} alt class="w-px-40 h-auto rounded-circle" />

                                </span>
                                <p class="app-brand-text demo menu-text fw-bold ms-2">Write<span style={{ color: "rgb(113, 221, 55)", fontSize: "3rem"}}>R</span></p>
                            </a>

                            <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                                <i class="bx bx-chevron-left bx-sm align-middle"></i>
                            </a>
                        </div>

                        <div class="menu-inner-shadow"></div>

                        <ul class="menu-inner py-1">
                            <li class="menu-item active open">
                                <Link href="/articles" class="menu-link menu-toggle">
                                    <i class="menu-icon tf-icons bx bx-home-circle"></i>
                                    <div data-i18n="Dashboards">All</div>
                                    <div class="badge bg-danger rounded-pill ms-auto">5</div>
                                </Link>
                                <ul class="menu-sub">
                                    {renderCategories(categories, level + 1)}                                    
                                    
                                </ul>
                            </li>

                            
                        </ul>
                    </aside>

                    <div class="layout-page">

                        {children}

                        <footer class="content-footer footer bg-footer-theme">
                            <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                                <div class="mb-2 mb-md-0">
                                    ©
                                    <script>
                                        document.write(new Date().getFullYear());
                                    </script>
                                    , made with ❤️ by
                                    <a href="https://themeselection.com" target="_blank" class="footer-link fw-medium">ThemeSelection</a>
                                </div>
                                <div class="d-none d-lg-inline-block">
                                    <a href="https://themeselection.com/license/" class="footer-link me-4" target="_blank">License</a>
                                    <a href="https://themeselection.com/" target="_blank" class="footer-link me-4">More Themes</a>

                                    <a
                                        href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                                        target="_blank"
                                        class="footer-link me-4"
                                    >Documentation</a
                                    >

                                    <a
                                        href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
                                        target="_blank"
                                        class="footer-link"
                                    >Support</a
                                    >
                                </div>
                            </div>
                        </footer>

                        <div class="content-backdrop fade"></div>
                    </div>
                </div>
            </div>

            <div class="layout-overlay layout-menu-toggle"></div>
        

        </>
    );
}
