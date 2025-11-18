
import React from 'react';
import type { NewsArticle } from '../types';
import { LinkIcon } from './icons';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{article.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-grow">{article.summary}</p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200 group"
        >
          <LinkIcon className="w-4 h-4" />
          <span>{article.sourceTitle}</span>
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
