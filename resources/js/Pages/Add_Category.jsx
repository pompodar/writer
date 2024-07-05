// src/components/ArticleForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = (props) => {
    const { categories } = props;
    const [selectedCategory, setSelectedCategory] = useState('');


    const [title, setTitle] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSelectChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            alert(title);
            await axios.post('/api/categories/create', { name: title, paren_id: selectedCategory });
            // Handle success (redirect, display a message, etc.)
        } catch (error) {
            // Handle error
            console.error('Error creating category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={title}
                onChange={handleTitleChange}
            />

            <div>
                {categories.length > 0 ? (
                    <>
                        <label htmlFor="categorySelect">Select a category:</label>
                        <select
                            id="categorySelect"
                            value={selectedCategory}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <p>No categories found</p>
                )}
            </div>

            <button type="submit">Add Category</button>
        </form>
    );
};

export default AddCategory;
