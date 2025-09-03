import React, { Component } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const CategoryList = ({ categories, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id_category}
          style={styles.categoryBox}
          onPress={() => onCategoryPress(category)}
        >
          <Image
            style={styles.icon}
            source={{ uri: category.image_category }}
          />
          <Text style={styles.info}>{category.name_category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      recipes: [],
      searchQuery: '',
      searchResults: [],
    };
  }

  componentDidMount() {
    this.fetchCategories();
    this.fetchRecipes();
  }

  handleCreateRecipe = () => {
    this.props.navigation.navigate('AddRecipeScreen');
  }

  fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.56.1/sideChef/db_sideChef.php?op=get_category');
      this.setState({ categories: response.data.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  fetchRecipes = async () => {
    try {
      const response = await axios.get('http://192.168.56.1/sideChef/db_sideChef.php?op=get_all_recipe');
      this.setState({ recipes: response.data.data });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

  handleSearch = (text) => {
    const { categories, recipes } = this.state;
    const filteredCategories = categories.filter(category =>
      category.name_category.toLowerCase().startsWith(text.toLowerCase())
    );
    const filteredRecipes = recipes.filter(recipe =>
      recipe.name_recipe.toLowerCase().startsWith(text.toLowerCase())
    );
    const searchResults = [...filteredCategories, ...filteredRecipes];
    this.setState({ searchQuery: text, searchResults });
  }

  handleCategoryPress = (category) => {
    this.props.navigation.navigate('IndonesianFoodScreen', { categoryId: category.id_category, categoryName: category.name_category });
    this.setState({ searchQuery: '', searchResults: [] });
  }

  handleRecipePress = (recipe) => {
    // Navigasi ke halaman detail resep dengan mengirimkan ID resep atau data lainnya
    this.props.navigation.navigate('Detail_IndonesianFoodScreen', {
      recipeId: recipe.id_recipe,
      foodName: recipe.name_recipe,
      categoryId: recipe.fk_id_category,
      categoryName: recipe.categoryName,
      ingredients: recipe.ingredients,
      steps: recipe.tutorial,
      image: recipe.cover_recipe ? { uri: recipe.cover_recipe } : require('../images/sideChef_greyScale.png'),
    });
  }

  renderSearchItem = ({ item }) => {
    if (item.name_category) {
      return (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() => this.handleCategoryPress(item)}
        >
          <Text style={styles.searchResultCategory}>
            Category: {item.name_category}
          </Text>
        </TouchableOpacity>
      );
    } else if (item.name_recipe) {
      return (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() => this.handleRecipePress(item)}
        >
          <Text style={styles.searchResultRecipe}>
            {item.name_recipe}
          </Text>
        </TouchableOpacity>
      );
    }
  };


  render() {
    const { categories, searchQuery, searchResults } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <ScrollView>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="What's so delicious to cook?"
              value={searchQuery}
              onChangeText={this.handleSearch}
            />
            {searchQuery.length > 0 && (
              <FlatList
                style={styles.searchResults}
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderSearchItem}
                ListEmptyComponent={<Text style={styles.noResultsText}>Oops! No results</Text>}
              />
            )}
          </View>
          <Text style={styles.categoryText}>Categories</Text>
          <View style={styles.categoryContainer}>
            {categories && categories.length > 0 ? (
              <CategoryList categories={categories} onCategoryPress={this.handleCategoryPress} />
            ) : (
              <Text>Loading...</Text>
            )}
          </View>

          <Text style={styles.categoryText}>Trending</Text>
          <WebView
            style={styles.webViewStyle}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/Acc-7Stw6jw?si=qy-b9UZXYUVOP6Dr' }}
          />
          <WebView
            style={styles.webViewStyle}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/UHH3ucvAqGA?si=TfKRYVHq7hBhW8Gp' }}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={this.handleCreateRecipe}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;

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
  searchBar: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 16,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  searchResults: {
    position: 'absolute',
    top: 65, // pas di bawah search bar
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 20,
    paddingVertical: 5,
    maxHeight: 250, // biar kalau banyak bisa scroll
  },
  searchResultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  searchResultCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F58634',
  },
  searchResultRecipe: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  noResultsText: {
    padding: 12,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  categoryContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryBox: {
    backgroundColor: '#fff',
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryText: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F58634',
  },
  webViewStyle: {
    height: 200,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#F58634',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
});
