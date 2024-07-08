import React from 'react';
import { Link } from '@inertiajs/react';

const ArticleCard = ({ article, categoryLevels }) => {
    const generateRandomNumber = (pictures_number = 72) => {
        return Math.floor(Math.random() * pictures_number) + 1;
    };

    const imageUrl = `../assets/img/elements/${generateRandomNumber()}.jpg`;

    const TruncateHTML = ({ html, maxWords }) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = doc.body.textContent || '';
        const words = text.split(' ');

        if (words.length <= maxWords) {
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }

        const truncatedText = words.slice(0, maxWords).join(' ').replace(/\.(?=\S)/g, '. ') + '...';

        return <div dangerouslySetInnerHTML={{ __html: truncatedText }} />;
    };

    return (
        <article key={article.id}>
            <div className="col-md">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-8">
                            <div className="card-body">
                                <Link className="mr-2 inline-block" href={`/articles/${article.id}/`}>
                                    <h2 className="card-title">{article.title}</h2>
                                </Link>
                                <div className="card-text">
                                    <TruncateHTML html={article.content} maxWords={100} />
                                </div>
                                {article.tags && (
                                    <div className="mt-3">
                                        {article.tags.map((tag) => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}                               
                                {article.categories && (
                                    <div className="mt-2">
                                        {article.categories.map((category) => (
                                            <ul key={category}>
                                                {category.ancestors
                                                    .map((ancestor) => ({
                                                        ...ancestor,
                                                        level: categoryLevels[ancestor.id],
                                                    }))
                                                    .sort((a, b) => a.level - b.level)
                                                    .map((ancestor) => (
                                                        <li key={ancestor.id}>
                                                            <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                                {ancestor.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                <span className="text-xs mt-4 px-2 py-1 rounded bg-indigo-50 text-indigo-500">
                                                    {category.name}
                                                </span>
                                            </ul>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <img className="card-img card-img-right" src={imageUrl} alt="Card image" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
