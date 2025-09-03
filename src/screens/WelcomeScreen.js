import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {StackActions} from '@react-navigation/native';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
      setTimeout( () => {
          this.props.navigation.dispatch(StackActions.replace('LoginScreen'))
      }, 5000);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../images/Logo_sideChef.png')}
            style={styles.logo}
          />
        </View>
        {/* <TouchableOpacity
          onPress={() => this.props.navigation.navigate('HomeScreen')}
          style={styles.startButton}>
          <Text style={{justifyContent: 'center', fontWeight: 600}}>
            Let's Explore!
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    marginTop: 200,
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: '#7BC04D',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
});