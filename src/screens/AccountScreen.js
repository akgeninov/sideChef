import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Import axios for uploading the image
import { useNavigation } from '@react-navigation/native';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      photo: '', // Replace with a valid photo URL
      uploadedRecipes: 5,
      uploadedRecipeList: ''
      // {
      //   id: '1',
      //   title: 'Pasta Carbonara',
      //   image: 'https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-master768-v2.jpg?width=1024&quality=75&auto=webp',
      //   foodName: 'Pasta Carbonara',
      //   author: 'John Doe',
      //   category: 'Dinner',
      //   ingredients: 'Pasta, Eggs, Pancetta, Parmesan, Pepper',
      //   steps: '1. Boil pasta.\n2. Cook pancetta.\n3. Mix with eggs and cheese.'
      // },
      // {
      //   id: '2',
      //   title: 'Chicken Salad',
      //   image: 'https://images.unsplash.com/photo-1506086679525-507f7746c67c?w=800&q=80'
      // },
      // {
      //   id: '3',
      //   title: 'Chicken Salad',
      //   image: 'https://images.unsplash.com/photo-1506086679525-507f7746c67c?w=800&q=80'
      // },
      // {
      //   id: '4',
      //   title: 'Chicken Salad',
      //   image: 'https://images.unsplash.com/photo-1506086679525-507f7746c67c?w=800&q=80'
      // },
      // // Add more recipes here
      ,
      isEditingName: false, // State to handle editing mode
      newName: '', // State to handle the new name input
      savedRecipes: [],
      savedRecipeList: [],
      userId: null,
      savedRecipesCount: 0,
      name_user: '',
      email: '',
      photo_user: '', // Replace with a valid photo URL
      uploadedRecipes: 5,
      uploadedRecipeList: [],
      isEditingName: false, // State to handle editing mode
      newName: '', // State to handle the new name input
      userId: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userId !== this.state.userId) {
      this.fetchSavedRecipes();
    }
  }

  fetchSavedRecipes = async () => {
    try {
      const userId = this.state.id_user;
      console.log("user id : ", userId);
      const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_saved_recipe_by_user&user_id=${userId}`);
      if (response.data && response.data.data) {
        const savedRecipes = response.data.data;
        console.log('saved recipes:', savedRecipes);
        const recipeIds = savedRecipes.map(recipe => recipe.fk_id_receipt);
        // this.fetchRecipes(recipeIds);
        const savedRecipesCount = savedRecipes.length;
        console.log('simpan : ', savedRecipesCount)
        this.setState({ savedRecipesCount });
      } else {
        console.log('No recipes found for user');
      }
    } catch (error) {
      console.error('Failed to fetch recipes by user', error);
    }
  };

  handleLogout = async () => {
    try {
      const response = await axios.post('http://192.168.56.1/sideChef/db_sideChef.php?op=logout_user', {
        // Add any additional data you need to send with the request
      });
      console.log('Logged out successfully', response.data);
      // Perform any additional actions after successful logout
      this.props.navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout failed', error);
      // Handle logout error
    }
  }

  fetchLoggedInUser = async () => {
    try {
      const userResponse = await axios.get('http://192.168.56.1/sideChef/db_sideChef.php?op=get_logged_in_user');
      const loggedInUser = userResponse.data.data;
      console.log('User logged in:', loggedInUser);
      this.setState({
        name_user: loggedInUser.username,
        email: loggedInUser.email,
        photo_user: loggedInUser.picture_user,
        id_user: loggedInUser.id_user, // Update state with user ID
      }, () => {
        // Callback to ensure the state is updated before fetching recipes
        this.fetchRecipeByUser();
        this.fetchSavedRecipes();
      });
      console.log({ name_user: loggedInUser.username });
      console.log({ email: loggedInUser.email });
      console.log({ photo_user: loggedInUser.picture_user });
    } catch (error) {
      console.error('Failed to fetch logged in user', error);
      // Handle fetch user error
    }
  }

  fetchRecipeByUser = async () => {
    try {
      const userId = this.state.id_user;
      console.log("user :", userId);
      const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=get_recipe_by_user&user_id=${userId}`);

      if (response.data && response.data.data) {
        const userRecipes = response.data.data;
        console.log('Recipes by user:', userRecipes);

        this.setState({
          uploadedRecipeList: userRecipes,
          uploadedRecipes: userRecipes.length,
        });
      } else {
        console.log('No recipes found for user');
      }
    } catch (error) {
      console.error('Failed to fetch recipes by user', error);
      // Handle fetch user recipes error
    }
  }


  handleEditName = () => {
    this.setState({ isEditingName: true });
  }

  handleSaveName = () => {
    this.setState({
      name: this.state.newName,
      isEditingName: false
    });
  }

  handleNameChange = (text) => {
    this.setState({ newName: text });
  }

  handleEditPhoto = () => {
    if (Platform.OS === 'web') {
      // Use HTML input element to select a file
      this.fileInput.click();
    } else {
      const options = {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      };

      launchImageLibrary(options, response => {
        if (response.assets && response.assets.length > 0) {
          const photoUri = response.assets[0].uri;
          this.setState({ photoUri });
          this.uploadPhoto(photoUri);
        }
      });
    }
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUri = reader.result;
        this.setState({ photoUri });
        this.uploadPhoto(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: Platform.OS === 'web' ? file : file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'profile.jpg'
    });

    try {
      const response = await axios.post('https://your-server-endpoint.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Photo uploaded successfully', response.data);
      // Handle successful upload response here
    } catch (error) {
      console.error('Photo upload failed', error);
      // Handle upload error here
    }
  }

  handleEditRecipe = (recipe) => {
    this.props.navigation.navigate('AddRecipeScreen', { recipe });
  }

  renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => this.handleEditRecipe(item)}>
      <Image source={item.cover_recipe ? { uri: item.cover_recipe } : require('../images/sideChef_greyScale.png')} style={styles.recipeCardImage} />
      <Text style={styles.recipeCardTitle}>{item.name_recipe}</Text>
    </TouchableOpacity>
  );

  componentDidMount() {
    this.fetchLoggedInUser();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      // This will run every time the screen is focused
      this.fetchLoggedInUser();
    });
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
  }

  render() {
    const { name_user, photo, email, savedRecipes, uploadedRecipes, uploadedRecipeList, isEditingName, newName, savedRecipesCount } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={this.handleEditPhoto}>
            <Image
              source={{ uri: photo || 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              ref={input => (this.fileInput = input)}
              style={{ display: 'none' }}
              onChange={this.handleFileChange}
            />
          )}
          <View style={styles.nameContainer}>
            {isEditingName ? (
              <TextInput
                style={styles.profileNameInput}
                value={newName}
                onChangeText={this.handleNameChange}
              />
            ) : (
              <Text style={styles.profileName}>{name_user}</Text>
            )}
            {/* <TouchableOpacity onPress={isEditingName ? this.handleSaveName : this.handleEditName}>
              <Text style={styles.editProfileButtonText}>{isEditingName ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity> */}
          </View>
          <Text style={styles.profileEmail}>{email}</Text>
          <View style={styles.recipeSection}>
            <TouchableOpacity
              style={styles.recipeCountContainer}
              onPress={() => this.props.navigation.navigate('Saved')} // Navigasi ke tab "Saved"
            >
              <Text style={styles.recipeCount}>{savedRecipesCount}</Text>
              <Text style={styles.recipeCountText}>Saved{'\n'}Recipes</Text>
            </TouchableOpacity>
            <View style={styles.recipeCountContainer}>
              <Text style={styles.recipeCount}>{uploadedRecipes}</Text>
              <Text style={styles.recipeCountText}>Uploaded{'\n'}Recipes</Text>
            </View>
          </View>
          <Text style={styles.uploadedRecipesTitle}>Uploaded Recipes</Text>
          <FlatList
            data={this.state.uploadedRecipeList}
            renderItem={this.renderRecipeCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.recipeList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Account;

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
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800'
  },
  profileNameInput: {
    fontSize: 20,
    color: 'black',
    fontWeight: '800',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
    textAlign: 'center',
    marginRight: 10, // Add some space between input and button
  },
  profileEmail: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  recipeSection: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around', // Adjust the width of the container
    width: '90%',
  },
  recipeCountContainer: {
    alignItems: 'center',
    width: 100, // Ensure the container has a fixed width
  },
  recipeCount: {
    fontSize: 17,
    color: 'black',
    fontWeight: '800'
  },
  recipeCountText: {
    fontSize: 16,
    marginTop: 5,
    color: 'grey',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '90%',
    borderStyle: 'solid',
    borderColor: '#F58634',
    borderWidth: 1.5
  },
  logoutButtonText: {
    color: '#F58634',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  editProfileButtonText: {
    color: '#F58634',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10, // Add some space between name and edit button
  },
  uploadedRecipesTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'left',
    alignSelf: 'flex-start', // Ensure the text is aligned to the start
    paddingLeft: 20, // Add padding to match the FlatList padding
  },
  recipeList: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15, // Add space between cards
    elevation: 3,
    width: 150, // Adjust the width of the card
  },
  recipeCardImage: {
    width: '100%',
    height: 100,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
    textAlign: 'center',
  },
});
