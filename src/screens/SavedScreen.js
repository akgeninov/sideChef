import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { BookmarkContext } from './BookmarkProvider';

const SavedScreen = () => {
    const { bookmarks } = useContext(BookmarkContext);
    const [savedRecipeList, setSavedRecipeList] = useState([]);
    const [userId, setUserId] = useState(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        if (isFocused) {
            fetchLoggedInUser();
        }
    }, [isFocused]);

    const fetchLoggedInUser = async () => {
        try {
            const userResponse = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_logged_in_user`);
            const loggedInUser = userResponse.data.data;
            console.log('User logged in:', loggedInUser);
            setUserId(loggedInUser.id_user);
            fetchSavedRecipes(loggedInUser.id_user);
        } catch (error) {
            console.error('Failed to fetch logged in user', error);
        }
    };

    const fetchSavedRecipes = async (userId) => {
        try {
            console.log("user id : ", userId);
            const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_saved_recipe_by_user&user_id=${userId}`);
            if (response.data && response.data.data) {
                const savedRecipes = response.data.data;
                console.log('saved recipes:', savedRecipes);
                const recipeIds = savedRecipes.map(recipe => recipe.fk_id_receipt);
                fetchRecipes(recipeIds);
                const savedRecipesCount = savedRecipes.length;
                console.log('jml: ', savedRecipesCount)
            } else {
                console.log('No recipes found for user');
            }
        } catch (error) {
            console.error('Failed to fetch recipes by user', error);
        }
    };

    const fetchRecipes = async (recipeIds) => {
        try {
            const recipeRequests = recipeIds.map(id => axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_recipe_by_id&id=${id}`));
            const responses = await Promise.all(recipeRequests);
            const savedRecipeList = responses.map(response => response.data.data);
            console.log('saved recipe list:', savedRecipeList);
            setSavedRecipeList(savedRecipeList);
        } catch (error) {
            console.error('Failed to fetch recipes by user', error);
        }
    };

    const renderRecipeCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                navigation.navigate('Detail_IndonesianFoodScreen', {
                    recipeId: item.id_recipe,
                    foodName: item.name_recipe,
                    ingredients: item.ingredients,
                    steps: item.tutorial,
                    image: item.cover_recipe ? { uri: item.cover_recipe } : require('../images/sideChef_greyScale.png'),
                    sourceScreen: 'Saved'
                })
            }}>
            <Image
                source={item.cover_recipe ? { uri: item.cover_recipe } : require('../images/sideChef_greyScale.png')}
                style={styles.image}
            />
            <View style={styles.cardContent}>
                <Text style={styles.foodName}>{item.name_recipe}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Saved</Text>
            </View>
            <FlatList
                data={savedRecipeList}
                renderItem={renderRecipeCard}
                keyExtractor={item => item.id_recipe.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

export default SavedScreen;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#F58634',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4, // bayangan di Android
        shadowColor: '#000', // bayangan di iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
    },
    listContent: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 10,
        justifyContent: 'center',
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    author: {
        fontSize: 14,
        color: 'gray',
    },
});