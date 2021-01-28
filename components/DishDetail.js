import React from 'react';
import { Card } from 'react-native-elements';
import {DISHES} from '../shared/dishes';

import { Text, View, ScrollView, FlatList } from 'react-native';
import { COMMENTS } from '../shared/comments';
import {Icon} from 'react-native-elements';
import axios from "axios";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={require('./images/uthappizza.png')}>
                    <Card.Title>{dish.name}</Card.Title>
                    <Card.Image source={require('./images/uthappizza.png')}></Card.Image>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

class Dishdetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites:[]
        };
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    static navigationOptions = {
        title: 'Dish Details'
    };

    render(){
        //const { itemId, otherParam } = route.params;
        const {dishId} = this.props.route.params;
        return(
            <>
        <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </>
        );
    }
}

//export default Dishdetail;
export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);