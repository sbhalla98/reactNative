import React from 'react';
import { Card } from 'react-native-elements';
import {DISHES} from '../shared/dishes';

import { Text, View, ScrollView, FlatList } from 'react-native';
import { COMMENTS } from '../shared/comments';
import {Icon} from 'react-native-elements';
import axios from "axios";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments
    }
  }

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
        this.setState({favorites: this.state.favorites.concat(dishId)});
        console.log('here1')
//         var xmlhttp;
//   if (window.XMLHttpRequest) {
//     xmlhttp = new XMLHttpRequest();
//   } else {
//     // code for older browsers
//     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//   }
//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       console.log(this.responseText);
//     }
//   };
//   xmlhttp.open("GET", 'https://run.mocky.io/v3/3d3ea152-6d41-4688-964a-18f9af25e64b', true);
//   xmlhttp.send();
console.log('here')
fetch('https://run.mocky.io/v3/3d3ea152-6d41-4688-964a-18f9af25e64b')
.then(response => {
    console.log(response)
    if (response.ok) {
      return response;
    } else {
      var error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
  error => {
        var errmess = new Error(error.message);
        throw errmess;
  })
.then(response => response.json()).then(data=>console.log(data))

//   axios.get('https://run.mocky.io/v3/3d3ea152-6d41-4688-964a-18f9af25e64b').then(response => response.data)
//     .then((data) => {
//       console.log(data)
//      })
    }
    static navigationOptions = {
        title: 'Dish Details'
    };

    render(){
        //const { itemId, otherParam } = route.params;
        const {dishId} = this.props.route.params;
        return(
            <>
        <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.state.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </>
        );
    }
}

//export default Dishdetail;
export default connect(mapStateToProps)(Dishdetail);