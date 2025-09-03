import React, { Component } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

class AddRecipeScreen extends Component {
  constructor(props) {
    super(props);
    const recipe = props.route.params?.recipe || null;

    this.state = {
      id_recipe: recipe ? recipe.id_recipe : null,
      name_recipe: recipe ? recipe.name_recipe : '',
      cover_recipe: recipe ? recipe.cover_recipe : '',
      fk_id_category: recipe ? recipe.fk_id_category : 'Select Category',
      categoryName: '',
      ingredients: recipe ? recipe.ingredients : '',
      tutorial: recipe ? recipe.tutorial : '',
      author: 'Your Name',
      isEditMode: !recipe, 
      categories: [], 
      loading: true, 
    };
  }

  componentDidMount() {
    this.fetchCategories()
      .then(categories => {
        if (Array.isArray(categories)) {
          this.setState({ categories, loading: false });
        } else {
          throw new Error('Categories data is not an array');
        }
      })
      .catch(error => {
        console.error('Error loading categories:', error);
        Alert.alert('Error', 'Failed to load categories. Please try again later.');
        this.setState({ loading: false });
      });
  }

  fetchCategories = async () => {
    try {
      const response = await fetch(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_category`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  handleSaveRecipe = async () => {
    const { id_recipe, name_recipe, cover_recipe, fk_id_category, ingredients, tutorial, author, isEditMode } = this.state;
  
    try {
      const formData = new FormData();
      formData.append('name_recipe', name_recipe);
      formData.append('cover_recipe', cover_recipe);
      formData.append('fk_id_category', fk_id_category);
      formData.append('ingredients', ingredients);
      formData.append('tutorial', tutorial);
      formData.append('author', author);
  
      let apiUrl = '';
      let method = 'POST';
  
      if (isEditMode && id_recipe) {
        formData.append('id_recipe', id_recipe.toString());
        apiUrl = `http://192.168.56.1/sideChef/db_sideChef.php?op=update_recipe&id_recipe=${id_recipe}`;
      } else {
        apiUrl = 'http://192.168.56.1/sideChef/db_sideChef.php?op=add_recipe';
      }
  
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Sukses', result.message, [
          { text: 'OK', onPress: () => this.navigateToRecipeDetail(id_recipe) }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Gagal menyimpan resep. Silakan coba lagi nanti.');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan resep.');
    }
  };
  
  navigateToRecipeDetail = (recipeId) => {
    this.props.navigation.navigate('Detail_IndonesianFoodScreen', { 
      recipeId,
      foodName: this.state.name_recipe,
      categoryId: this.state.fk_id_category,
      categoryName: this.state.categoryName,
      ingredients: this.state.ingredients,
      steps: this.state.tutorial,
      image: this.state.cover_recipe ? { uri: this.state.cover_recipe} : require('../images/sideChef_greyScale.png'),
    });
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

  toggleEditMode = () => {
    const { recipe } = this.props.route.params;
    if (recipe) {
      const { id_recipe } = recipe;
      this.setState({ isEditMode: true, id_recipe });
    }
  };

  handleDeleteRecipe = async () => {
    const { recipe } = this.props.route.params;
    const { id_recipe } = recipe;
  
    if (!id_recipe) {
        Alert.alert('Error', 'Recipe ID is missing.');
        return;
    }
  
    Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this recipe?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        const formData = new FormData();
                        formData.append('id_recipe', id_recipe);
  
                        const response = await fetch(`http://192.168.56.1/sideChef/db_sideChef.php?op=delete_recipe&id_recipe=${id_recipe}`, {
                            method: 'POST',
                            body: formData,
                        });
  
                        const responseText = await response.text();
  
                        if (!response.ok) throw new Error('Failed to delete recipe.');
  
                        let result = JSON.parse(responseText);
  
                        if (result.message) {
                            Alert.alert('Success', result.message, [
                                { text: 'OK', onPress: () => this.props.navigation.navigate('Account') }
                            ]);
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (error) {
                        Alert.alert('Error', 'An error occurred while deleting the recipe. Please try again.');
                    }
                }
            }
        ],
        { cancelable: false }
    );
  };

  render() {
    const { isEditMode, name_recipe, cover_recipe, fk_id_category, ingredients, tutorial, categories, loading } = this.state;
    const isNewRecipe = !this.props.route.params?.recipe;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{isNewRecipe ? 'Tambah Resep Baru' : 'Lihat Resep'}</Text>
          {!isNewRecipe && !isEditMode && (
            <TouchableOpacity style={styles.editButton} onPress={this.toggleEditMode}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nama Makanan */}
        <TextInput
          style={styles.input}
          placeholder="Nama Makanan"
          onChangeText={(text) => this.setState({ name_recipe: text })}
          value={name_recipe}
          editable={isEditMode}
        />

        {/* URL Gambar */}
        <TextInput
          style={styles.input}
          placeholder="URL Gambar"
          onChangeText={(text) => this.setState({ cover_recipe: text })}
          value={cover_recipe}
          editable={isEditMode}
        />

        {/* Kategori */}
        {loading ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#F58634" />
        ) : (
          <View style={[styles.pickerContainer, { opacity: isEditMode ? 1 : 0.5 }]}>
            <Picker
              selectedValue={fk_id_category}
              style={styles.picker}
              onValueChange={(itemValue) => this.setState({ fk_id_category: itemValue })}
              enabled={isEditMode}
            >
              <Picker.Item label="Pilih Kategori" value="Pilih Kategori" />
              {categories.map(category => (
                <Picker.Item key={category.id_category} label={category.name_category} value={category.id_category.toString()} />
              ))}
            </Picker>
          </View>
        )}

        {/* Bahan-bahan */}
        <Text style={styles.sectionTitle}>Bahan-bahan</Text>
        {isEditMode ? (
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Bahan-bahan (pisahkan dengan enter)"
            multiline={true}
            onChangeText={(text) => this.setState({ ingredients: text })}
            value={ingredients}
          />
        ) : (
          <View style={styles.stepsContainer}>
            {ingredients
              .split('\n')
              .filter(item => item.trim() !== '')
              .map((item, index) => (
                <Text key={index} style={styles.stepText}>
                  • {item}
                </Text>
              ))}
          </View>
        )}

        {/* Langkah-langkah */}
        <Text style={styles.sectionTitle}>Langkah-langkah</Text>
        {isEditMode ? (
          <TextInput
            style={[styles.input, { height: 120 }]}
            placeholder="Langkah-langkah (pisahkan dengan enter)"
            multiline={true}
            onChangeText={(text) => this.setState({ tutorial: text })}
            value={tutorial}
          />
        ) : (
          <View style={styles.stepsContainer}>
            {tutorial
              .split('\n')
              .filter(step => step.trim() !== '')
              .map((step, index) => (
                <Text key={index} style={styles.stepText}>
                  {index + 1}. {step}
                </Text>
              ))}
          </View>
        )}

        {/* Tombol Save / Tambah */}
        {isEditMode && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleSaveRecipe}
          >
            <Text style={styles.buttonText}>{isNewRecipe ? 'Tambah Resep' : 'Simpan Perubahan'}</Text>
          </TouchableOpacity>
        )}

        {/* Tombol Delete */}
        {!isNewRecipe && (
          <TouchableOpacity
            style={[styles.addButton, styles.deleteButton]}
            onPress={this.handleDeleteRecipe}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Recipe</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }
}

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    padding: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#F58634',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F58634',
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: '#F58634',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
