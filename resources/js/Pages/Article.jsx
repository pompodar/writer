import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage, router, Link } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Articles = ({ auth, props, query }) => {
    const { article } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [categories, setCategories] = useState([]);

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

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
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

            router.visit('/articles/', {
                method: 'get',
                preserveState: true,
                onCancel: () => { },
                onSuccess: (page) => {
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
            
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

    const handleEdit = (article) => {
        setEditingArticle(article);
        setUpdatedArticle({
            title: article.title,
            body: article.body,
            tags: article.tags || [],
            categories: article.categories[0].id || "",
        });
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get('/api/articles');
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
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
            router.visit('/articles/' + articleId + "/", {
                method: 'get',
                preserveState: true,
                onCancel: () => { },
                onSuccess: (page) => {
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
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

    console.log(updatedArticle.categories);

    function generateRandomNumber() {
        return Math.floor(Math.random() * 63) + 1;
    }

    const imageUrl = `/assets/img/elements/${generateRandomNumber()}.jpg`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div class="content-wrapper">
                <div class="container-xxl flex-grow-1 container-p-y">
                    <h4 class="py-1 mb-2">
                        <span class="text-muted fw-light">
                        
                            <Link className="mr-2" href={"/articles/"}>
                                Articles
                            </Link>
                            /
                        </span>
                    </h4>

                    <div>

                                <article key={article.id}>
                                    {editingArticle === article ? (
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
                                                                    <br/>
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
                                                                    onClick={() => handleUpdate(article.id)}>
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
                                                                <h2 class="card-title">{article.title}</h2>

                                                                <div className="card-text">
                                                                  <div dangerouslySetInnerHTML={{ __html: article.body }} />
                                                                </div>

                                                                <div className="mt-3">
                                                                    {article.tags &&
                                                                        article.tags.map((tag) => (
                                                                            <span
                                                                                key={tag}
                                                                                className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                                <ul className="mt-2">
                                                                    {article.categories &&
                                                                        article.categories.map((category) => (
                                                                            <li>
                                                                                <span
                                                                                    className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500"
                                                                                    key={category.id}>
                                                                                    {category.name}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                </ul>
                                                                <button
                                                                    className="mr-2 mt-2"
                                                                    onClick={() => handleEdit(article)}>
                                                                    <i
                                                                        style={{ color: '#71dd37' }}
                                                                        class="bx bx-edit-alt me-1"></i>
                                                                    <small>edit</small>
                                                                </button>
                                                                <button
                                                                    className="mr-2 mt-2"
                                                                    onClick={() => handleDelete(article.id)}>
                                                                    <i class="bx bx-trash me-1 text-danger"></i>
                                                                    <small>delete</small>
                                                                </button>
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
                    </div>

                    {/* Display pagination links */}
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Articles;
