import React from 'react';
import { StyleSheet, Text, View, StatusBar  } from 'react-native';

export default class Notifs extends React.Component {

    render() {
      
        return (
            <View style={style.view}>
                <StatusBar hidden />
                <Text style={style.title}>A propos de notre groupe</Text>
                <Text>/que des victimes/</Text>
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