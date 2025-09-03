import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

class AddRecipeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodName: '',
      image: '',
      author: '',
      category: 'Select Category',
      ingredients: '',
      steps: '',
    };
  }

  handleAddRecipe = () => {
    // Code to add the recipe to the database or perform other actions
    console.log('Recipe added:', this.state);
    // Show success alert
    Alert.alert('Success', 'Add recipe successfully', [
      {
        text: 'OK',
        onPress: () => this.props.navigation.navigate('Home')
      }
    ]);
  }

  handleBack = () => {
    // Code for back button action
    console.log('Back button pressed');
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Recipe</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Food Name"
          onChangeText={(text) => this.setState({ foodName: text })}
          value={this.state.foodName}
        />
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          onChangeText={(text) => this.setState({ image: text })}
          value={this.state.image}
        />
        <TextInput
          style={styles.input}
          placeholder="Author"
          onChangeText={(text) => this.setState({ author: text })}
          value={this.state.author}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={this.state.category}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ category: itemValue })
            }>
            <Picker.Item label="Select Category" value="Select Category" />
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Dinner" value="Dinner" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Ingredients"
          multiline={true}
          onChangeText={(text) => this.setState({ ingredients: text })}
          value={this.state.ingredients}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Steps"
          multiline={true}
          onChangeText={(text) => this.setState({ steps: text })}
          value={this.state.steps}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={this.handleAddRecipe}
        >
          <Text style={styles.buttonText}>Add Recipe</Text>
        </TouchableOpacity>
      </View>
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
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#F58634',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
