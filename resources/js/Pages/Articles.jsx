import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage, router, Link } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Articles = ({ auth, query }) => {
    const { articles } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);

    const [categoryLevels, setCategoryLevels] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(3); // Number of articles per page

    const { categoryId } = usePage().props;

    const [editingArticle, setEditingArticle] = useState(null);
    const [updatedArticle, setUpdatedArticle] = useState({
        title: '',
        body: '',
        tags: [],
        categories: [],
    });

    const initialOpenCategories = JSON.parse(localStorage.getItem('openCategories')) || [];

    const initialVisibleLevels = JSON.parse(localStorage.getItem('visibleLevels')) || [0, 1, 2];

    const [openCategories, setOpenCategories] = useState(initialOpenCategories);
    const [renderedCategories, setRenderedCategories] = useState([]);

    const [visibleLevels, setVisibleLevels] = useState(initialVisibleLevels);

    const [categoryHierarchy, setCategoryHierarchy] = useState([]);

    function generateRandomNumber(pictures_number = 72) {
        return Math.floor(Math.random() * pictures_number
        ) + 1;
    } 

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/wp-json/custom/v1/categories/`);
            const categories = response.data;
            if (categories.length > 0) {
                console.log(categories);
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

    const isOpen = (categoryId) => openCategories.includes(categoryId);

    const buildCategoryHierarchy = (categories) => {
        const categoryMap = {};
        const levelMap = {};

        // Create a map of categories with an additional level property
        categories.forEach((category) => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        const hierarchy = [];

        // Function to set levels recursively
        const setLevels = (category, level) => {
            category.level = level;
            levelMap[category.id] = level;
            category.children.forEach(child => setLevels(child, level + 1));
        };

        // Build the hierarchy
        categories.forEach((category) => {
            if (category.parent_id === null) {
                hierarchy.push(categoryMap[category.id]);
            } else {
                categoryMap[category.parent_id].children.push(categoryMap[category.id]);
            }
        });

        // Set levels starting from the root categories
        hierarchy.forEach(rootCategory => setLevels(rootCategory, 0));

        console.log(hierarchy, 'hierarchy');

        return { hierarchy, levelMap };
    };

    const findCategoryLevel = (category) => {
        let currentCategory = category;
        console.log(buildCategoryHierarchy(categories).find(cat => cat.id === currentCategory), currentCategory);
        let level = buildCategoryHierarchy(categories).find(cat => cat.id === currentCategory) ? buildCategoryHierarchy(categories).find(cat => cat.id === currentCategory).level : null;
        return level;
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

    const imageUrlAside = `/assets/img/elements/${generateRandomNumber(13)}.jpg`;
    const randomNumberAside = generateRandomNumber(38);
    const bgUrlAside = `url(../assets/img/elements-aside/${randomNumberAside}.jpg)`;

    useEffect(() => {
        fetchArticles();
        fetchCategories(); // Fetch categories when the component mounts
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

    const handleDelete = async (articleId) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this category?');

        if (!shouldDelete) {
            return; // If the user cancels, do nothing
        }

        try {
            // Send a DELETE request to delete the article
            await axios.delete(`/api/articles/${articleId}`);
            // After deletion, fetch the updated list of articles
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tags') {
            // Split the comma-separated string into an array
            const newArray = value.split(',').map((item) => item.trim());
            setUpdatedArticle((prev) => ({
                ...prev,
                [name]: newArray,
            }));
        } else if (name === 'categories') { 
            setUpdatedArticle((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setUpdatedArticle((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleTagsChange = (tags) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            tags,
        }));
    };

    const handleCategoriesChange = (selectedCategories) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            categories: selectedCategories,
        }));
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setUpdatedArticle({
            title: article.title,
            body: article.body,
            tags: article.tags || [],
            categories: article.categories || [],
        });
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

    const handleChange = (content, delta, source, editor) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            body: content,
        }));
    };

    const handleUpdate = async (articleId) => {
        try {
            // Send a PUT request to update the article
            await axios.put(`/api/articles/${articleId}`, updatedArticle);
            // After updating, fetch the updated list of articles
            fetchArticles();
            // Reset editing state
            setEditingArticle(null);
            setUpdatedArticle({
                title: '',
                body: '',
                tags: [],
                categories: [],
            });
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    function exit() {
        setEditingArticle(null);
    }

    const TruncateHTML = ({ html, maxWords }) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = doc.body.textContent || '';
        const words = text.split(' ');

        if (words.length <= maxWords) {
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }

        // Add a space between paragraphs
        const htmlWithSpaces = html.replace(/<\/p><p>/g, '</p> <p>');

        const truncatedText = words.slice(0, maxWords).join(' ').replace(/\.(?=\S)/g, '. ') + '...';

        return <div dangerouslySetInnerHTML={{ __html: truncatedText }} />;
    };

    function handleCategoryClick(category) {
        router.visit('/articles/', {
            method: 'get',
            data: { category },
            preserveState: true,
            onCancel: () => {},
            onSuccess: (page) => {},
            onError: (errors) => { console.log(errors); },
            onFinish: visit => {},
        });
    }

    const randomNumber = generateRandomNumber(29);

    const bgClass = `bg-[url(../assets/img/elements/${randomNumber}.jpg)]`;
    const bgUrl = `url(../assets/img/elements-white/${randomNumber}.jpg)`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <aside id="layout-menu" className="layout-menu menu-vertical relative bg-menu-theme">
                <div className="decorative absolute bottom-0 left-0 right-0 top-[70%]" style={{ backgroundImage: bgUrlAside }}></div>
                <div className="app-brand demo">
                    <a href="/" className="app-brand-link">
                        <span className="app-brand-logo demo shadow-2xl w-[72px] absolute top-[2px]" style={{ boxShadow: "5px 5px 5px 0px rgba(0,0,0,0.75)", borderRadius: "50%" }}>
                            <img src={imageUrlAside} alt className="h-auto rounded-circle shadow-2xl" />
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
                        <ul className="menu-sub">
                            {renderCategories(categoryHierarchy, 0)}
                        </ul>
                    </li>
                </ul>
            </aside>
            <div className="layout-page bg-white">
                <nav
                    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center"
                    id="layout-navbar">
                    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                        <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                            <i class="bx bx-menu bx-sm"></i>
                        </a>
                    </div>
                    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                        <div class="navbar-nav align-items-center">
                            <div class="nav-item d-flex align-items-center">
                                <i class="bx bx-search fs-4 lh-0 text-indigo-500"></i>
                                <input
                                    type="text"
                                    class="form-control border-0 shadow-none ps-1 ps-sm-2"

                                    name="q"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                />

                            </div>
                        </div>

                        <ul class="navbar-nav flex-row align-items-center ms-auto">
                            <li class="nav-item lh-1 me-3">
                                <a
                                    class="github-button"
                                    href="https://github.com/themeselection/sneat-html-admin-template-free"
                                    data-icon="octicon-star"
                                    data-size="large"
                                    data-show-count="true"
                                    aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"
                                >Star</a
                                >
                            </li>

                            <li class="nav-item navbar-dropdown dropdown-user dropdown">
                                <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                                    <div class="avatar avatar-online">
                                        <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                                    </div>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a class="dropdown-item" href="#">
                                            <div class="d-flex">
                                                <div class="flex-shrink-0 me-3">
                                                    <div class="avatar avatar-online">
                                                        <img src="/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <span class="fw-medium d-block">John Doe</span>
                                                    <small class="text-muted">Admin</small>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <div class="dropdown-divider"></div>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#">
                                            <i class="bx bx-user me-2"></i>
                                            <span class="align-middle">My Profile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#">
                                            <i class="bx bx-cog me-2"></i>
                                            <span class="align-middle">Settings</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#">
                                            <span class="d-flex align-items-center align-middle">
                                                <i class="flex-shrink-0 bx bx-credit-card me-2"></i>
                                                <span class="flex-grow-1 align-middle ms-1">Billing</span>
                                                <span class="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <div class="dropdown-divider"></div>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="javascript:void(0);">
                                            <i class="bx bx-power-off me-2"></i>
                                            <span class="align-middle">Log Out</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    
                </nav>

                <div className={`content-wrapper ${bgClass}`} style={{ backgroundImage: bgUrl, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                    <div class="container-xxl flex-grow-1 container-p-y">

                        <nav class="py-1 mb-2 flex justify-between align-center">
                            <span class="fw-light text-[tomato] font-bold flex text-lg align-center p-2 rounded bg-white">Articles  / 
                                <Link className="mr-2" href={"/articles/add/"}>
                                    {/* <i
                                        style={{ color: '#71dd37', fontSize: 14 }}
                                        class="inline-block bx ml-1 bx-edit-alt me-1">
                                    </i> */}
                                    <i
                                        style={{  fontSize: 14 }}
                                        class="bx bx-add-to-queue text-indigo-500 ml-[1.6px] mt-[-2.5px]">
                                    </i>
                                </Link>
                            </span>

                            {searchQuery && (
                                <span class="text-muted fw-light cursor-pointer ml-auto">
                                    {/* Using search: <strong>"{searchQuery}"</strong>.{' '} */}
                                    <span onClick={clearFilters}>clear filters</span>
                                </span>
                            )}
                            {results.length > 0 && (
                                <ul className="pagination ml-auto flex align-center">
                                    {/* Previous page link */}
                                    {currentPage > 1 && (
                                        <li className="page-item">
                                            <button className="page-link text-indigo-500" onClick={() => {
                                                setCurrentPage(currentPage - 1);
                                                fetchArticles(currentPage - 1);
                                            }}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                    )}

                                    {/* Page numbers */}
                                    {[...Array(results[0]?.total_pages || 1).keys()].map((page) => (
                                        <li key={page + 1} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                                            <button className="page-link text-indigo-500" onClick={() => {
                                                setCurrentPage(page + 1);
                                                fetchArticles(page + 1);
                                            }}>{page + 1}</button>                                
                                        </li>
                                    ))}

                                    {/* Next page link */}
                                    {currentPage < results[0].total_pages && (
                                        <li className="page-item">
                                            <button className="page-link text-indigo-500" onClick={() => {
                                                setCurrentPage(currentPage + 1);
                                                fetchArticles(currentPage + 1);
                                            }}>
                                                Next
                                            </button>                                
                                        </li>
                                    )}
                                </ul>
                            )}
                        </nav>
                        <div>
                            {results.length > 0 ? (
                                results.map((result) => {
                                    const imageUrl = `../assets/img/elements/${generateRandomNumber()}.jpg`;
                                    return (
                                        <article key={result.id}>
                                            {editingArticle === result ? (
                                                <>
                                                    <div class="row">
                                                        <div class="col-xl">
                                                            <div class="card mb-4">
                                                                <div class="card-header d-flex justify-content-between align-items-center"></div>
                                                                <div class="card-body">
                                                                    <div>
                                                                        <div class="mb-3">
                                                                            <label class="form-label" for="basic-default-fullname">
                                                                                Title
                                                                            </label>
                                                                            <input
                                                                                className="form-control rounded"
                                                                                type="text"
                                                                                name="title"
                                                                                placeholder="Title"
                                                                                value={updatedArticle.title}
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            />
                                                                        </div>
                                                                        <div class="mb-3">
                                                                            <label class="form-label" for="basic-default-company">
                                                                                Content
                                                                            </label>
                                                                            <ReactQuill
                                                                                className="form-control p-0 rounded"
                                                                                name="content"
                                                                                theme="snow"
                                                                                formats={[
                                                                                    'header',
                                                                                    'bold',
                                                                                    'italic',
                                                                                    'underline',
                                                                                    'strike',
                                                                                    'blockquote',
                                                                                    'list',
                                                                                    'bullet',
                                                                                    'indent',
                                                                                    'link',
                                                                                    'image',
                                                                                    'code-block',
                                                                                    'color',
                                                                                    'background',
                                                                                ]}
                                                                                modules={{
                                                                                    //syntax: true,
                                                                                    toolbar: [
                                                                                        'header',
                                                                                        'bold',
                                                                                        'italic',
                                                                                        'list',
                                                                                        'image',
                                                                                        'blockquote',
                                                                                        'underline',
                                                                                        'link',
                                                                                        'code-block',
                                                                                        'list',
                                                                                        { color: ['orangered', 'rgb(113, 221, 55)'] },
                                                                                        { background: ['orangered', 'rgb(113, 221, 55)'] },
                                                                                        'indent',
                                                                                    ],
                                                                                }}
                                                                                value={updatedArticle.content.renderd}
                                                                                onChange={handleChange}
                                                                            />
                                                                        </div>

                                                                        <div class="mb-3">
                                                                            <label class="form-label" for="basic-default-tags">
                                                                                Tags
                                                                            </label>
                                                                            <input
                                                                                className="form-control rounded"
                                                                                type="text"
                                                                                name="tags"
                                                                                placeholder="Tags"
                                                                                value={updatedArticle.tags.join(', ')} // Assuming tags is an array
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            />
                                                                        </div>

                                                                        <div class="mb-3">
                                                                            <label class="form-label" for="basic-default-categories">
                                                                                Categories
                                                                            </label>
                                                                            <br />
                                                                            <select
                                                                                className="form-control rounded"
                                                                                name="categories"
                                                                                value={updatedArticle.categories[0] ? updatedArticle.categories[0].id : ""} // Assuming categories is an array
                                                                                onChange={(e) => handleInputChange(e)}
                                                                            >
                                                                                {categories.map((cat) => (
                                                                                    <option key={cat.id} value={cat.id}>
                                                                                        {cat.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>

                                                                        
                                                                        </div>

                                                                        <button
                                                                            className="btn btn-primary mr-2"
                                                                            onClick={() => handleUpdate(result.id)}>
                                                                            Update
                                                                        </button>

                                                                        <button className="btn btn-primary" onClick={exit}>
                                                                            Exit
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div class="col-md">
                                                        <div class="card mb-3">
                                                            <div class="row g-0">
                                                                <div class="col-md-8">
                                                                    <div class="card-body">
                                                                        <Link className="mr-2 inline-block" href={`/articles/${result.id}/`}>
                                                                            <h2 class="card-title">{result.title}</h2>
                                                                        </Link>
                                                                        <div className="card-text">
                                                                            <TruncateHTML html={result.content} maxWords={100} />
                                                                        </div>
                                                                            {result.tags && (
                                                                                <div className="mt-3">
                                                                                    {result.tags &&
                                                                                        result.tags.map((tag) => (
                                                                                            <span
                                                                                                key={tag}
                                                                                                className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                                {tag}
                                                                                            </span>
                                                                                        ))}
                                                                                </div>
                                                                            )
                                                                            }
                                                                            {result.categories && (
                                                                                <div className="mt-2">
                                                                                    {result.categories.map((category) => (
                                                                                        <ul key={category}>
                                                                                            {category.ancestors
                                                                                            .map((ancestor) => ({
                                                                                                ...ancestor,
                                                                                                level: categoryLevels[ancestor.id],
                                                                                            }))
                                                                                            .sort((a, b) => a.level - b.level)
                                                                                            .map((ancestor) => (
                                                                                                <li key={ancestor.id} onClick={() => toggleAccordion({ id: ancestor.id, name: ancestor.name, level: categoryLevels[ancestor.id] })} className="inline cursor-pointer">
                                                                                                    <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                                        {ancestor.name}
                                                                                                    </span>
                                                                                                </li>
                                                                                            ))}
                                                                                            <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                                {category.name}
                                                                                            </span>
                                                                                            {/* {category.descendants
                                                                                            .map((descendant) => ({
                                                                                                ...descendant,
                                                                                                level: categoryLevels[descendant.id],
                                                                                            }))
                                                                                            .sort((a, b) => a.level - b.level)
                                                                                            .map((descendant) => (
                                                                                                <li key={descendant.id} onClick={() => toggleAccordion({ id: descendant.id, name: descendant.name, level: descendant.level })} className="inline cursor-pointer">
                                                                                                    <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                                        {descendant.name}
                                                                                                    </span>
                                                                                                </li>
                                                                                            ))} */}
                                                                                        </ul>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <img
                                                                        class="card-img card-img-right"
                                                                        src={imageUrl}
                                                                        alt="Card image"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </article>
                                    )
                                })
                            ) : (
                                <p>No articles found</p>
                            )}
                        </div>
                        {results.length > 0 && (
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    {/* Previous page link */}
                                    {currentPage > 1 && (
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => {
                                                setCurrentPage(currentPage - 1);
                                                fetchArticles(currentPage - 1);
                                            }}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                    )}

                                    {/* Page numbers */}
                                    {[...Array(results[0]?.total_pages || 1).keys()].map((page) => (
                                        <li key={page + 1} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => {
                                                setCurrentPage(page + 1);
                                                fetchArticles(page + 1);
                                            }}>{page + 1}</button>                                
                                        </li>
                                    ))}

                                    {/* Next page link */}
                                    {currentPage < results[0].total_pages && (
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => {
                                                setCurrentPage(currentPage + 1);
                                                fetchArticles(currentPage + 1);
                                            }}>
                                                Next
                                            </button>                                
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
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
            </div>    
        </AuthenticatedLayout>
    );
};

export default Articles;
