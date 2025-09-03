import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const IndonesianFood = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const { categoryId } = route.params;

  useEffect(() => {
    if (isFocused) {
      fetchCategoryName(categoryId);
      fetchRecipes(categoryId);
    }
  }, [isFocused, categoryId]);

  const fetchRecipes = async (categoryId) => {
    try {
      const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_recipe_by_category&category_id=${categoryId}`);
      console.log('Fetched recipes:', response.data);
      setRecipes(response.data.data); // Assuming the data is wrapped in 'data' property
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_name_category_by_id&id=${categoryId}`);
      console.log('Fetched category name:', response.data);
      setCategoryName(response.data.data.name_category);
    } catch (error) {
      console.error('Error fetching category name:', error);
    }
  };

  const renderRecipe = ({ item }) => {
    console.log('Rendering item:', item);
    return (
      <TouchableOpacity
        key={item.id_recipe}
        style={styles.card}
        onPress={() => {
          navigation.navigate('Detail_IndonesianFoodScreen', {
            recipeId: item.id_recipe,
            foodName: item.name_recipe,
            category: item.category_name,
            ingredients: item.ingredients,
            steps: item.tutorial,
            id_author: item.fk_id_user, // ✅ kirim id_author (foreign key user)
            image: item.cover_recipe
              ? { uri: item.cover_recipe }
              : require('../images/sideChef_greyScale.png'),
            categoryId: categoryId,
            categoryName: categoryName
          });
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.foodName}>{item.name_recipe}</Text>
        </View>
        <Image
          style={styles.cardImage}
          source={item.cover_recipe ? { uri: item.cover_recipe } : require('../images/sideChef_greyScale.png')}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.backButton}>
          <Image
            source={require('../images/left-arrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName} Food</Text>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No recipes for this category</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={recipes}
          keyExtractor={(item) => item.id_recipe.toString()}
          renderItem={renderRecipe}
          horizontal={false}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
};


export default IndonesianFood;

const styles = StyleSheet.create({
  headerContainer: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#F5863415', // transparan oranye biar ada highlight
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#F58634',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F58634',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  separator: {
    marginTop: 12,
  },
  card: {
    backgroundColor: 'white',
    flexBasis: '47%',
    marginHorizontal: 6,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F58634',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#F5863410', // soft orange background
  },
  cardImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
  },
});
