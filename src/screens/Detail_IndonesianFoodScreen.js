import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    ToastAndroid,
    ScrollView
} from 'react-native';
import { BookmarkContext } from '../screens/BookmarkProvider';
import axios from 'axios';

class Detail_IndonesianFoodScreen extends Component {
    constructor(props) {
        super(props);
        const { recipeId, foodName, category, ingredients, steps, image, categoryId, categoryName, id_author, authorName, sourceScreen } = props.route.params;
        this.state = {
            bookmarked: false,
            recipeId,
            foodName,
            category,
            ingredients,
            steps,
            image,
            categoryId,
            categoryName,
            id_author,
            authorName,
            sourceScreen // Added sourceScreen to state
        };
    }

    static contextType = BookmarkContext;

    componentDidMount() {
        this.fetchCategoryName();
        this.checkBookmarkStatus();
        this.fetchAuthorName();
    }

    checkBookmarkStatus = async () => {
        const { recipeId } = this.state;
        try {
            const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=check_bookmark&recipe_id=${recipeId}`);
            const isBookmarked = response.data.data.bookmarked;
            this.setState({ bookmarked: isBookmarked });
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    toggleBookmark = async () => {
        const { toggleBookmark } = this.context;
        const { recipeId, bookmarked } = this.state;

        try {
            const response = await axios.get(`http://192.168.56.1/sideChef/db_sideChef.php?op=toggle_save_recipe&recipe_id=${recipeId}`);

            if (response.data.message === 'Recipe saved successfully.' || response.data.message === 'Recipe unsaved successfully.') {
                this.setState({ bookmarked: !bookmarked }, () => {
                    toggleBookmark({ ...this.state });
                });
                const message = !bookmarked ? 'Saved!' : 'Unsaved!';
                ToastAndroid.show(message, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Terjadi kesalahan!', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error toggling recipe save status:', error);
            ToastAndroid.show('Terjadi kesalahan!', ToastAndroid.SHORT);
        }
    };

    fetchCategoryName = async () => {
        try {
            const response = await axios.get(
                `http://192.168.56.1/sideChef/db_sideChef.php?op=get_name_category_by_id&id=${this.state.categoryId}`
            );
            this.setState({ categoryName: response.data.data.name_category }, () => {
                console.log('category: ', this.state.categoryName);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    fetchAuthorName = async () => {
        try {
            console.log('id_author param:', this.state.id_author);

            const response = await axios.get(
                `http://192.168.56.1/sideChef/db_sideChef.php?op=get_author_name_by_id&id=${this.state.id_author}`
            );

            console.log('response author:', response.data);

            if (response.data && response.data.data && response.data.data.username) {
                this.setState(
                    { authorName: response.data.data.username },
                    () => console.log('author state:', this.state.authorName)
                );
            } else {
                this.setState({ authorName: 'Unknown' });
            }
        } catch (error) {
            console.error('Error fetching author:', error);
        }
    };

    handleBackPress = () => {
        const { navigation } = this.props;
        const { sourceScreen, categoryId, categoryName } = this.state;

        if (sourceScreen === 'Saved') {
            navigation.navigate('Saved');
        } else {
            navigation.navigate('IndonesianFoodScreen', { categoryId, categoryName });
        }
    };

    render() {
        const { bookmarked, foodName, categoryName, ingredients, steps, image } = this.state;
        return (
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <TouchableOpacity onPress={this.handleBackPress} style={styles.circle}>
                        <Image source={require('../images/left-arrow.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.toggleBookmark} style={[styles.circle, { left: 'auto', right: 20 }]} activeOpacity={1}>
                        <Image source={bookmarked ? require('../images/bookmark-solid.png') : require('../images/bookmark-regular.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
                <Image source={image} style={styles.img} />
                <View style={styles.container}>
                    <View>
                        <Text style={styles.title}>{foodName}</Text>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.author}>
                            <Text style={{ fontWeight: 'bold' }}>by:</Text> {this.state.authorName}
                        </Text>
                    </View>
                    <FlatList
                        data={[
                            { key: 'Ingredients:', content: ingredients, type: 'ingredients' },
                            { key: 'Steps:', content: steps, type: 'steps' },
                        ]}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.subtitle}>{item.key}</Text>
                                {item.content
                                    .split("\n")
                                    .filter(line => line.trim() !== "")
                                    .map((line, index) => (
                                        <Text key={index} style={styles.text}>
                                            {item.type === "steps"
                                                ? `${index + 1}. ${line}`
                                                : `• ${line}`}
                                        </Text>
                                    ))}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default Detail_IndonesianFoodScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'left',
        justifyContent: 'center',
        backgroundColor: '#FFFF',
        paddingLeft: 10,
        paddingRight: 10,
        top: -30,
        borderRadius: 30,
        paddingBottom: 20,
        paddingTop: 10
    },
    circle: {
        backgroundColor: 'white',
        width: 35,
        height: 35,
        position: 'absolute',
        top: 20,
        left: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        elevation: 4,
    },
    img: {
        width: '100%',
        height: 270,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 7,
        marginTop: 7,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F58634',
        marginLeft: 20,
        marginRight: 20,
    },
    text: {
        fontSize: 16,
        color: 'black',
        marginLeft: 20,
        marginRight: 20,
    },
    author: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
    },
});
