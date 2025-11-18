
import React, { useState, useCallback } from 'react';
import type { NewsArticle } from './types';
import { fetchNews } from './services/geminiService';
import NewsCard from './components/NewsCard';
import LoadingSpinner from './components/LoadingSpinner';
import { SearchIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('検索キーワードを入力してください。');
      return;
    }
    setLoading(true);
    setError(null);
    setNews([]);

    try {
      const results = await fetchNews(query);
      setNews(results);
    } catch (err) {
      console.error(err);
      setError('ニュースの取得中にエラーが発生しました。しばらくしてからもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-blue-500" />
            <span>AI News Summarizer</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            気になるキーワードを入力して、関連ニュースの要約をチェックしよう
          </p>
        </header>

        <main>
          <div className="max-w-2xl mx-auto mb-8 sticky top-4 z-10">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="例: 「最新のAI技術」"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={loading}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
              >
                {loading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center my-8 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto" role="alert">
              <strong className="font-bold">エラー: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading && <LoadingSpinner />}

          {!loading && news.length === 0 && !error && (
             <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p className="text-xl">キーワードを入力してニュース検索を開始してください。</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {news.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
