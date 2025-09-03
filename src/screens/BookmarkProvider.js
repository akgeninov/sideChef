import React, { createContext, useState } from 'react';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

    const toggleBookmark = (recipe) => {
        setBookmarkedRecipes(prevState => {
            if (prevState.some(r => r.foodName === recipe.foodName)) {
                return prevState.filter(r => r.foodName !== recipe.foodName);
            } else {
                return [...prevState, recipe];
            }
        });
    };

    return (
        <BookmarkContext.Provider value={{ bookmarkedRecipes, toggleBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
};
