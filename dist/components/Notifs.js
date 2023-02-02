import React from 'react';
import { StyleSheet, Text, View, StatusBar  } from 'react-native';

export default class Notifs extends React.Component {

    render() {
      
        return (
            <View style={style.view}>
                <StatusBar hidden />
                <Text style={style.title}>A propos de moi</Text>
                <Text>notre projet va etre psm les freros</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
  view: {
    margin: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 20
  }
})