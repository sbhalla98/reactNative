import React, { Component } from 'react';
import Menu from './MenuComponent';
import { DISHES } from '../shared/dishes';

import Dishdetail from './DishDetail';
import { View ,Platform,StyleSheet,Text,ScrollView} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './HomeComponent';
import AboutUs from './AboutComponent';
import ContactUs from './ContactComponent';
import { Icon,Image} from 'react-native-elements';
import {
  DrawerItems,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { baseUrl } from '../shared/baseUrl';

import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

import Reservation from './ReservationComponent';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

class MenuNavigator extends Component{

    constructor(props) {
        super(props);
        this.state = {
          dishes: DISHES,
          selectedDish: null
        };
      }
      onDishSelect(dishId) {
        this.setState({selectedDish: dishId})
        console.log('here')
        }
        
    render(){
    return(
    <NavigationContainer initialRouteName="Menu" independent>
    <Stack.Navigator screenOptions={{headerTintColor:'#fff',headerStyle:{backgroundColor:'#512DA8'}}}>
      <Stack.Screen name="Menu" options={{headerShown:true,headerLeft:()=>(<Icon size={18} name="menu" color="white" style={{marginLeft:10}} onPress={()=>{this.props.navigation.toggleDrawer()}}></Icon>)}}>{props => <Menu {...props} dishes={this.state.dishes} onPress={(dishId) => this.onDishSelect(dishId)}></Menu>}</Stack.Screen>
      <Stack.Screen name="DishDetail">{props =>  <Dishdetail {...props} dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />}</Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
    )
    }
}

const CustomDrawerContentComponent = (props) => (
  <DrawerContentScrollView {...props}>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.drawerHeader}>
        <View style={{flex:1}}>
        <Image source={require('./images/logo.png')} style={styles.drawerImage} />
        </View>
        <View style={{flex: 2}}>
          <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </SafeAreaView>
  </DrawerContentScrollView>
);

class Main extends Component {

  componentDidMount() {
   this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
  render() {
 
    return (
        <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
        <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home"
                screenOptions={{
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    headerShown:true,
                    headerStyle :{
                        backgroundColor :'#512DA8'
                    },
                    //drawerBackgroundColor='#512DA8'
                  }}
                drawerContent={props => <CustomDrawerContentComponent {...props} />}
                >
                <Drawer.Screen name="Home" component={Home} options={{drawerIcon:({headerTintColor})=>(<Icon size={24} name="home" color={headerTintColor}  type='font-awesome'></Icon>)}} />
                <Drawer.Screen name="About Us" component={AboutUs} options={{drawerIcon:({headerTintColor})=>(<Icon size={24} name="info-circle" color={headerTintColor}  type='font-awesome'></Icon>)}}/>
                <Drawer.Screen name="Menu" component={MenuNavigator} options={{headerShown:false,drawerIcon:({headerTintColor})=>(<Icon size={24} name="list" color={headerTintColor}  type='font-awesome'></Icon>)}} />
                <Drawer.Screen name="Contact Us" component={ContactUs} options={{drawerIcon:({headerTintColor})=>(<Icon size={22} name="address-card" color={headerTintColor}  type='font-awesome'></Icon>)}}/>
                <Drawer.Screen name="Reserve Table" component={Reservation} options={{drawerIcon:({headerTintColor})=>(<Icon size={22} name="cutlery" color={headerTintColor}  type='font-awesome'></Icon>)}}/>
                </Drawer.Navigator>
        </NavigationContainer>
        </View>
    );
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});