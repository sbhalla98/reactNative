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

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES
        };
    }

    static navigationOptions = {
        title: 'Menu'
    };


    renderMenuItem = ({item, index}) => {
        const { navigate } = this.props.navigation;
        return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    //leftAvatar={{ source:{uri: baseUrl + 'images/logo.png'}}}
                    onPress={() => this.props.navigation.navigate('DishDetail', { dishId: item.id })}
                  >
                      <Avatar source={require('./images/uthappizza.png')} rounded />
                        <ListItem.Content>
                        <ListItem.Title>{item.name}</ListItem.Title>
                        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                        </ListItem.Content>
                  </ListItem>
        );
    };

    render(){
        if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
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