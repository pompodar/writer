import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage, router, Link } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Articles = ({ auth, props, query }) => {
    const { articles } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);

    console.log(articles);

    const [editingArticle, setEditingArticle] = useState(null);
    const [updatedArticle, setUpdatedArticle] = useState({
        title: '',
        body: '',
        tags: [],
        categories: [],
    });

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

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

            console.log(articles.data);

            for (const key in articles) {
                console.log(articles);
                hitsArray.push(articles[key]);
            }

            if (searchQuery) {
                setResults(() => articles);
            } else {
                articles.data ? setResults(() => articles.data) : setResults(() => articles[0]);
            }
        }
    }, [query, articles]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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

    const fetchArticles = async () => {
        try {
            const response = await axios.get('/api/articles');
            console.log(response.data);
            setResults(response.data.articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
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

    console.log(updatedArticle.categories);

    function generateRandomNumber() {
        return Math.floor(Math.random() * 63
        ) + 1;
    } 

    const getParentNames = (category) => {
        const parentNames = [];

        while (category && category.parent_id) {
            parentNames.push(
                <Link key={category.id} href={category.name.toLowerCase()}>
                    {category.name}
                </Link>
            );
            
            if (category.parent_id) {
                category = category.parent;
            } else {
                break;
            }

            console.log(parentNames);
        }

        // return parentNames.reverse().join(' / ');
        return parentNames.reverse().map((element, index) => (
            <React.Fragment key={index}>
                {index > 0 && ' / '}
                {element}
            </React.Fragment>
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user}>

            <nav
                class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                id="layout-navbar">
                <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                    <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                        <i class="bx bx-menu bx-sm"></i>
                    </a>
                </div>

                <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                    <div class="navbar-nav align-items-center">
                        <div class="nav-item d-flex align-items-center">
                            <i class="bx bx-search fs-4 lh-0"></i>
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

            <div class="content-wrapper">
                <div class="container-xxl flex-grow-1 container-p-y">

                    <h4 class="py-1 mb-2 flex">
                        <span class="text-muted fw-light">Articles  / 
                            <Link className="mr-2" href={"/articles/add/"}>
                                {""}<i
                                    style={{ color: '#71dd37', fontSize: 14 }}
                                    class="bx bx-edit-alt me-1"></i>add
                            </Link>
                        </span>

                        {searchQuery && (
                            <span class="text-muted fw-light cursor-pointer ml-auto">
                                {/* Using search: <strong>"{searchQuery}"</strong>.{' '} */}
                                <span onClick={clearFilters}>clear filters</span>
                            </span>
                        )}
                    </h4>

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
                                                                            value={updatedArticle.body}
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
                                                                        <TruncateHTML html={result.body} maxWords={36} />
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
                                                                            <ul className="mt-2">
                                                                                {result.categories.map((category) => (
                                                                                    <li key={category.id}>
                                                                                        <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                            {/* {category.parent && category.parent.name + " / "}{category.name} */}
                     
                                                                                            {getParentNames(category)}
                                                                                        </span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        )}

                                                                    {/* <button
                                                                        className="mr-2 mt-2"
                                                                        onClick={() => handleEdit(result)}>
                                                                        <i
                                                                            style={{ color: '#71dd37' }}
                                                                            class="bx bx-edit-alt me-1"></i>
                                                                        <small>edit</small>
                                                                    </button> */}
                                                                    {/* <button
                                                                        className="mr-2 mt-2"
                                                                        onClick={() => handleDelete(result.id)}>
                                                                        <i class="bx bx-trash me-1 text-danger"></i>
                                                                        <small>delete</small>
                                                                    </button> */}
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

                    {/* Display pagination links */}
                    <div className="pagination">
                        {articles.prev_page_url && (
                            <Link className="mr-2" href={articles.prev_page_url}>
                                Previous
                            </Link>
                        )}

                        {articles.next_page_url && <Link href={articles.next_page_url}>Next</Link>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Articles;
