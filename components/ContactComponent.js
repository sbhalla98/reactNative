import React from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';


export default class ContactUs extends React.Component{
    render(){
    const space = "\n\n";
    return (
        <Animatable.View animation="fadeInDown" duration={1000} delay={1000}> 
        <Card>
            <Card.Title>Contact Information</Card.Title>
            <Card.Divider/>
            <Text style={{margin: 10}}>
            121, Clear Water Bay Road{space}
            Clear Water Bay, Kowloon{space}
            HONG KONG{space}
            Tel: +852 1234 5678{space}
            Fax: +852 8765 4321{space}
            Email:confusion@food.net
            </Text>
        </Card>
        </Animatable.View>
    );
    }
}
