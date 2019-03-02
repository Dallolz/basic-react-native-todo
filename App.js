import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import {Constants} from 'expo';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAoPDhhTHxcwB3vA_YrnzS2r_m55-JNu5o",
  authDomain: "todolist-rn-12c33.firebaseapp.com",
  databaseURL: "https://todolist-rn-12c33.firebaseio.com",
  projectId: "todolist-rn-12c33",
  storageBucket: "todolist-rn-12c33.appspot.com",
  messagingSenderId: "435013194572"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      message: '',
      messages: []
    }
    this.addItem = this.addItem.bind(this);
  }

  componentDidMount() {
  firebase
   .database()
   .ref()
   .child("messages")
   .once("value", snapshot => {
     const data = snapshot.val()
     if (snapshot.val()) {
       const initMessages = [];
       Object
        .keys(data)
        .forEach(message => initMessages.push(data[message]));
       this.setState({
         messages: initMessages
       })
     }
   });

  firebase
   .database()
   .ref()
   .child("messages")
   .on("child_added", snapshot => {
     const data = snapshot.val();
     if (data) {
       this.setState(prevState => ({
         messages: [data, ...prevState.messages]
       }))
     }
   })
  }
  addItem(){
    if (!this.state.message) return;

    const newMessage = firebase.database().ref()
                        .child("messages")
                        .push();
    newMessage.set(this.state.message, () => this.setState({message: ''}))
  }

  deleteItem(){
//firebase linked function to delete some .child("messages")

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.todoBox}>
          <TextInput placeholder='Enter your task' value={this.state.message} onChangeText={(text) => this.setState({message: text})}
          style={styles.txtInput}/>
            <Button title='Send' onPress={this.addItem}/>
        </View>
        <FlatList data={this.state.messages}
          renderItem={
            ({item}) => 
          <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>
              {item}
            </Text>
          </View>
          }
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
      marginTop: Constants.statusBarHeight //to not override the status bar on any OS(problem with expo)
    },
    todoBox: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: '#fff'
    },
    txtInput: {
      flex: 1
    },
    listItemContainer: {
      backgroundColor: '#fff',
      margin: 5,
      borderRadius: 5
    },
    listItem: {
      fontSize: 20,
      padding: 10
    }
});
