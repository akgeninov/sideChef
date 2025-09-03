import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);

    useEffect(() => {
        // Load initial bookmarks from API or local storage if needed
        const fetchBookmarkedRecipes = async () => {
            try {
                const response = await axios.get('http://192.168.56.1/sideChef/db_sideChef.php?op=get_saved_recipes');
                setBookmarkedRecipes(response.data.bookmarkedRecipes);
            } catch (error) {
                console.error('Error fetching bookmarked recipes:', error);
            }
        };

        fetchBookmarkedRecipes();
    }, []);

    const toggleBookmark = async (recipe) => {
        try {
            const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=toggle_save_recipe&fk_id_receipt=${recipe.recipeId}`);
            if (response.data.message === 'Recipe saved successfully.') {
                setBookmarkedRecipes(prevState => [...prevState, recipe]);
            } else if (response.data.message === 'Recipe already saved.') {
                setBookmarkedRecipes(prevState => prevState.filter(r => r.recipeId !== recipe.recipeId));
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    return (
        <BookmarkContext.Provider value={{ bookmarkedRecipes, toggleBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
};
