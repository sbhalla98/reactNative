import React from 'react';
import { Text,Alert } from 'react-native';
import { Card ,Button,Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';


export default class ContactUs extends React.Component{
    render(){
    
    sendMail =async  ()=> {
        let permission = await MailComposer.isAvailableAsync();
        if(permission){
        await MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        }).then(res=>console.log(res))
        }else{
            Alert.alert(
                'your device doesnt support this feature !!!',
                ``,
                [],
                { cancelable: true }
            );
        }
    }
    const space = "\n\n"
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
            <Button
                title="Send Email"
                buttonStyle={{backgroundColor: "#512DA8"}}
                icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                onPress={sendMail}
            />
        </Card>
        </Animatable.View>
    );
    }
}
