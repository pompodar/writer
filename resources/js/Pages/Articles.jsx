import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '../Components/Pagination';
import Footer from '../Components/Footer';
import ProfileDropdown from '../Components/ProfileDropdown';
import Aside from '../Components/Aside';
import ArticleCard from '../Components/ArticleCard';
import SearchInput from '../Components/SearchInput';

const Articles = ({ auth, query }) => {
    const { articles } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageLogo, setImageLogo] = useState(null);
    const [imageAside, setImageAside] = useState(null);
    const [imageCard, setImageCard] = useState(null);
    const [imageBack, setImageBack] = useState(null);

    const [categoryLevels, setCategoryLevels] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(1);

    const { categoryId } = usePage().props;

    const initialOpenCategories = JSON.parse(localStorage.getItem('openCategories')) || [];

    const initialVisibleLevels = JSON.parse(localStorage.getItem('visibleLevels')) || [0, 1, 2];

    const [openCategories, setOpenCategories] = useState(initialOpenCategories);

    const [visibleLevels, setVisibleLevels] = useState(initialVisibleLevels);

    const [categoryHierarchy, setCategoryHierarchy] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/wp-json/custom/v1/categories/`);
            const categories = response.data;
            if (categories.length > 0) {
                setCategories(categories);
                const { hierarchy, levelMap } = buildCategoryHierarchy(categories);
                setCategoryHierarchy(hierarchy);
                setCategoryLevels(levelMap);
            } else {
                console.log("No categories");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchImages = async (cat) => {
        try {
            const response = await axios.get(`http://localhost:8080/wp-json/custom/v1/media/?category_slug=${cat}`);
            const images = response.data;
            if (images.length > 0) {
                const randomIndex = Math.floor(Math.random() * images.length);
                const randomImage = images[randomIndex];
                return randomImage.url;
            } else {
                console.log("No images");
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchCategoriesAndImage = async () => {
            await fetchCategories();
            const imageAside = await fetchImages('aside');
            setImageAside(imageAside);

            const imageLogo = await fetchImages('logo');
            setImageLogo(imageLogo);

            const imageCard = await fetchImages('card');
            setImageCard(imageCard);

            const imageBack = await fetchImages('back');
            setImageBack(imageBack);
        };
        
        fetchCategoriesAndImage();
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

        router.visit('/articles/', {
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

    const buildCategoryHierarchy = (categories) => {
        const categoryMap = {};
        const levelMap = {};

        categories.forEach((category) => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        const hierarchy = [];

        const setLevels = (category, level) => {
            category.level = level;
            levelMap[category.id] = level;
            category.children.forEach(child => setLevels(child, level + 1));
        };

        categories.forEach((category) => {
            if (category.parent_id === null) {
                hierarchy.push(categoryMap[category.id]);
            } else {
                categoryMap[category.parent_id].children.push(categoryMap[category.id]);
            }
        });

        hierarchy.forEach(rootCategory => setLevels(rootCategory, 0));

        return { hierarchy, levelMap };
    };

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, [categoryId]);

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        } else {
            let params = new URLSearchParams(document.location.search);
            let q = params.get('q');

            if (q) {
                setSearchQuery(q);
            }
            const hitsArray = [];

            // console.log(articles.data);

            // for (const key in articles) {
            //     console.log(articles);
            //     hitsArray.push(articles[key]);
            // }

            // if (searchQuery) {
            //     setResults(() => articles);
            // } else {
            //     articles.data ? setResults(() => articles.data) : setResults(() => articles[0]);
            // }
        }
    }, [query, articles]);

    const fetchSearchResults = (query) => {
        if (query) {
            router.visit('/articles', {
                method: 'get',
                data: { q: query },
                preserveState: true,
                onCancel: () => { },
                onSuccess: (page) => {
                    setSearchQuery(query);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    };

    const fetchArticles = async (currentPage = 1) => {
        axios.get(`http://localhost:8080/wp-json/custom/v1/articles_by_cat/?cat=${categoryId}&page=${currentPage}&per_page=${perPage}`)
        .then(function(response) {
            var posts = response.data;
            if (posts) {
                setResults(posts);
            } else {
                console.log("No posts");
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    };

    const handleSearchInput = (e) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);
        fetchSearchResults(inputValue);
    };

    const clearFilters = () => {
        setSearchQuery('');
        fetchArticles();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Aside 
                imageLogo={imageLogo}
                imageAside={imageAside}
                categoryHierarchy={categoryHierarchy}
                openCategories={openCategories}
                toggleAccordion={toggleAccordion}
                visibleLevels={visibleLevels}
            />
            <div className="layout-page bg-white">
                <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center" id="layout-navbar">
                    <div className="app-brand demo lg:hidden max-w-0 mr-[66px]">
                        <a href="/" className="app-brand-link">
                            <span className="app-brand-logo demo shadow-2xl w-[72px] h-[72px] absolute top-[-10px] left-0" style={{ boxShadow: "5px 5px 5px 0px rgba(0,0,0,0.75)", borderRadius: "50%" }}>
                                <img src={imageLogo} alt className="h-full w-full rounded-circle shadow-2xl" />
                            </span>
                        </a>
                    </div>
                    <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                        <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                            <i className="bx bx-menu bx-sm"></i>
                        </a>
                    </div>
                    <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                        <div className="navbar-nav align-items-center">
                            <SearchInput 
                                searchQuery={searchQuery}
                                handleSearchInput={handleSearchInput}
                            />
                        </div>
                        <ProfileDropdown
                        />    
                    </div>                    
                </nav>
                <div className={`content-wrapper`} style={{backgroundImage: `url(${imageBack})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                    <div className="container-xxl flex-grow-1 container-p-y">
                        <nav className="py-1 mb-2 flex justify-between align-items-center">
                            <Link className="mr-2 flex align-items-center bg-white p-2 rounded" href={"/articles/add/"}>
                                <i className="bx bx-add-to-queue text-indigo-500 text-2xlg hover:text-[tomato]"></i>
                            </Link>
                            {searchQuery && (
                                <span className="text-muted fw-light cursor-pointer ml-auto">
\                                    <span onClick={clearFilters}>clear filters</span>
                                </span>
                            )}
                            {results.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={results[0]?.total_pages || 1}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    fetchArticles(page);
                                }}
                            />
                        )}
                        </nav>
                        <div>
                            {results.length > 0 ? (
                                results.map((result) => {
                                    return (
                                        <ArticleCard 
                                            key={result.id}
                                            article={result}
                                            categoryLevels={categoryLevels}
                                            imageCard={imageCard}
                                        />
                                    )
                                })
                            ) : (
                                <p>No articles found</p>
                            )}
                        </div>
                        {results.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={results[0]?.total_pages || 1}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    fetchArticles(page);
                                }}
                            />
                        )}
                    </div>
                </div>
                <Footer />
            </div>    
        </AuthenticatedLayout>
    );
};

export default Articles;
