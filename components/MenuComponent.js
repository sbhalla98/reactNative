import React from 'react';
import { View, FlatList } from 'react-native';
import { ListItem , Avatar} from 'react-native-elements';
import {DISHES} from '../shared/dishes';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
      dishes: state.dishes
    }
  }

class Menu extends React.Component{
    
    static navigationOptions = {
        title: 'Menu'
    };


    renderMenuItem = ({item, index}) => {
        const arr =[require('./images/uthappizza.png'),require('./images/zucchipakoda.png'),require('./images/vadonut.png'),require('./images/elaicheesecake.png')]
        return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    onPress={() => this.props.navigation.navigate('DishDetail', { dishId: item.id })}
                  >
                      <Avatar source={arr[index]} rounded />
                        <ListItem.Content>
                        <ListItem.Title>{item.name}</ListItem.Title>
                        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                        </ListItem.Content>
                  </ListItem>
        );
    };

    render(){
        if (this.props.dishes.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.dishes.errMess) {
            return(
                <View>            
                    <Text>{props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
    return (
        
            <FlatList 
                data={this.props.dishes.dishes}
                renderItem={this.renderMenuItem}
                keyExtractor={item => item.id.toString()}
                style={{padding:0,margin:0}}
                />
    );}
    }
}


export default connect(mapStateToProps)(Menu);