import React from 'react';

const SearchAndSort = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => (
    <div className="search-and-sort">
        <div className='search-box'>
            <span>Search:</span>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
        </div>
        <div className="sort-select">
            <span>Sort By:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
            </select>
        </div>
    </div>
);

export default SearchAndSort;
