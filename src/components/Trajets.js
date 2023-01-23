import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class Home extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            city:'Montpellier'
        }
    }

    setCity (city) {
        this.setState({city})
    }

    render() {
        return (
            <View>
                <Text> Départ :</Text>
                <TextInput 
                onChangeText={(text) => this.setCity(text)}
                style={{paddingLeft: 5,height: 40, borderColor: 'grey', borderWidth: 1}}
                value={this.state.city}
                />
                <Text> Arrivée :</Text>
                <TextInput 
                onChangeText={(text) => this.setCity(text)}
                style={{paddingLeft: 5,height: 40, borderColor: 'grey', borderWidth: 1}}
                value={this.state.city}
                />
            </View>
        )
    }
}