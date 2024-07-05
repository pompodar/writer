// src/components/ArticleForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, router, Link } from '@inertiajs/react';


const AddArticle = ({auth}) => {
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [title, setTitle] = useState('');

    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTagsChange = (e) => {
        const tagInput = e.target.value;
        // Split the input into an array of tags
        const tagArray = tagInput.split(',').map(tag => tag.trim());
        setTags(tagArray);
    };

    const handleSelectChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/articles/create', {
                title: title,
                content: content,
                tags: tags,
                selectedCategory: selectedCategory
            });

            // Access the response data
            router.visit('/articles/' + response.data.article.id + "/", {
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
            // Handle error
            console.error('Error creating article:', error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div class="content-wrapper">
                <div class="container-xxl flex-grow-1 container-p-y">
                    <h4 class="py-1 mb-2">
                        <span class="text-muted fw-light">
                            <Link className="mr-2" href={"/articles"}>
                                Articles
                            </Link>
                        /</span>
                    </h4>

        <div class="row add-article">
            <div class="col-xl">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center"></div>
                    <div class="card-body">
                <form onSubmit={handleSubmit}>

                                                                <div class="mb-3">
                                                                    <label class="form-label" for="basic-default-fullname">
                                                                        Title
                                                                    </label>
                                                                    <input
                                                                        className="form-control rounded"
                                                                        type="text"
                                                                        name="title"
                                                                        placeholder="Title"
                                                                        value={title}
                                                                        onChange={handleTitleChange}
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
                                                                                { color: ['orangered', 'aqua'] },
                                                                                { background: ['orangered', 'aqua'] },
                                                                                'indent',
                                                                            ],
                                                                        }}
                                                                        value={content}
                                                                        onChange={setContent}
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
                                                                        value={tags.join(', ')} // Assuming tags is an array
                                                                        onChange={handleTagsChange}
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
                    value={selectedCategory} // Assuming categories is an array
                    onChange={handleSelectChange}
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
                                                                    type="submit">
                                                                    Add
                                                                </button>

                                                                {/* <button className="btn btn-primary" onClick={exit}>
                                                                    Exit
                                                                </button> */}
                        </form>
                    </div>
                </div>
            </div>
        </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddArticle;
