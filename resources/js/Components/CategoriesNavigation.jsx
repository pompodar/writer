import React from 'react';
import { Link } from '@inertiajs/react';

const CategoriesNavigation = ({ categoryHierarchy, openCategories, toggleAccordion, visibleLevels }) => {
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

    const isOpen = (categoryId) => openCategories.includes(categoryId);

    return (
        <ul className="menu-sub">
            {renderCategories(categoryHierarchy, 0)}
        </ul>
    );
};

export default CategoriesNavigation;
