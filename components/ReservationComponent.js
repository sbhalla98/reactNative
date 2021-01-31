import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, View, StyleSheet, Picker, Switch, Button,ScrollView,Alert,Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date()
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };


    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            showModal: false,
            expoPushToken :'',
            notification: false,
            permissionCallendar:false,
            callendarId:0,
            showdatePicker:false
        });
    }

   schedulePushNotification =async ()=> {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Your Reservation',
            body: 'Reservation for '+ this.state.date + ' requested',
            sound: 'notification.wav'
          },
          trigger: { seconds: 1 },
        });
      }

      addReservationToCalendar = async () => {
        const date  = Date.parse(this.state.date);
        if(this.state.permissionCallendar){
        Calendar.createEventAsync(this.state.callendarId,{
            title:'Con Fusion Table Reservation',
            startDate:date,
            endDate:date + 2*60*60*1000,
            location:'121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
            timeZone:'Asia/Hong_Kong'
        }).then((result)=>{
            console.log('Event added sucessfully',result);
        }).catch(err=>{
            console.log('error',err);
        })
        }
      }

    
      registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }

      obtainCalendarPermission = async () =>{
        if(Calendar.isAvailableAsync){
        let callendarPermission = await Calendar.requestCalendarPermissionsAsync();
        if (callendarPermission.status === 'granted') {
            this.setState({permissionCallendar:true});
            let callendar;
            if(Platform.OS === 'ios'){
                callendar =await Calendar.getDefaultCalendarAsync() 
                this.setState({callendarId:callendar[0].id})
            }else{
                callendar =await Calendar.getCalendarsAsync();
                this.setState({callendarId:callendar.id})
            }
        }else{
            callendarPermission = await Calendar.requestCalendarPermissionsAsync();
            this.setState({permissionCallendar:true});
            let callendar;
            if(Platform.OS === 'ios'){
                callendar =await Calendar.getDefaultCalendarAsync() 
                this.setState({callendarId:callendar[0].id})
            }else{
                callendar =await Calendar.getCalendarsAsync();
                this.setState({callendarId:callendar.id})
            }
        }
        }else{
            Alert.alert(
                'your device doesnt support this feature !!!',
                ``,
                [],
                { cancelable: true }
            );
        }
      }


      notificationListener = React.createRef();
      responseListener =React.createRef();
      componentDidMount() {
        this.obtainCalendarPermission();
        this.registerForPushNotificationsAsync().then(token => this.setState({expoPushToken : token })).catch(err=>console.log('error in pushing notification'));
    
        this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          this.setState({ notification });
        });
    
        this.responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    }

      componentWillUnmount() {
        Notifications.removeNotificationSubscription(this.notificationListener);
        Notifications.removeNotificationSubscription(this.responseListener);
      }
    handleReservation() {
        Alert.alert(
            'YOUR RESERVATION OK?',
            ` Number of Guests: ${this.state.guests} \n Smoking?: ${this.state.smoking ? 'Yes' : 'No'}  \n Date and Time: ${this.state.date}`,
            [
                { 
                    text: 'Cancel', 
                    onPress: () => this.resetForm(),
                    style: ' cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        await this.schedulePushNotification();
                        await this.obtainCalendarPermission();
                        await this.addReservationToCalendar();
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false }
        );
    }
    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
    
    render() {
        return(
            <Animatable.View animation="zoomIn" duration={1000} delay={500}> 
            <ScrollView>
                <Card>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRowDate}>
                <Text style={styles.formLabel}>Date and Time</Text>
                {Platform.OS === 'ios' && <DateTimePicker
                testID="dateTimePicker"
                value={this.state.date}
                mode='datetime'
                display="default"
                onChange={(event,date) => { if(date)this.setState({date: date})}}
                />
                }
                </View>
                <View style={styles.formRow}>
                <Button
                    onPress={() => this.handleReservation()}
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                </Card>
            </ScrollView>
            </Animatable.View>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formRowDate: {
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default Reservation;