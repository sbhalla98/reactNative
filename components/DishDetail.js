import React from 'react';
import { Card } from 'react-native-elements';
import {DISHES} from '../shared/dishes';

import { Text, View, ScrollView, FlatList,Modal,StyleSheet } from 'react-native';
import { COMMENTS } from '../shared/comments';
import {Icon,Input,Button} from 'react-native-elements';
import axios from "axios";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite , postComment} from '../redux/ActionCreators';
import { Rating, AirbnbRating } from 'react-native-elements';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment : (id,dishId,comment,author,rating,date) => dispatch(postComment(id,dishId,comment,author,rating,date))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating startingValue={item.rating} readonly imageSize={15} style={{padding:10,paddingLeft:0,alignItems:'left'}}/>
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
            scrollEnabled
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
                    <View style={styles.icons}>
                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    style={{flex:1}}
                    />
                    <Icon
                    raised
                    reverse
                    name="pencil"
                    type='font-awesome'
                    color='rgb(75,51,163)'
                    onPress={() => props.toggleModal()}
                    style={{flex:2}}
                    />
                    </View>
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
            favorites:[],
            showModal: false,
            author:'',
            comment:'',
            rating:5,
            comment_err:false,
            name_err :false
        };
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    static navigationOptions = {
        title: 'Dish Details'
    };
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    render(){
        const {dishId} = this.props.route.params;
        return(
            <>
            <ScrollView>
        <RenderDish dish={this.props.dishes.dishes[+dishId]} favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} toggleModal={()=>this.setState({showModal: !this.state.showModal})} />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </ScrollView>
        <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                    <Rating
                        showRating
                        onFinishRating={(rating)=>this.setState({rating})}
                        style={{ paddingVertical: 10 }}
                        startingValue={5}
                    />
                    <Input
                    placeholder='Author'
                    errorMessage={this.state.name_err ? 'Please Enter Your Name' : ''}
                    leftIcon={
                         <Icon
                    name='user-o'
                    size={24}
                    color='black'
                    type="font-awesome"
                            />
                     }
                     onChangeText={value =>this.setState({ author: value })}
                            />
                            <Input
                    placeholder='Comment'
                    errorMessage={this.state.comment_err ? 'Please Enter a Valid Comment' : ''}
                    leftIcon={
                         <Icon
                    name='comment-o'
                    size={24}
                    type="font-awesome"
                            />
                     }
                     onChangeText={value => this.setState({ comment: value })}
                            />
                    
                        <Button 
                            onPress = {() =>{
                                if(this.state.comment.length === 0){
                                    this.setState({ comment_err : true })
                                }else{
                                    this.setState({ comment_err : false })
                                }
                                if(this.state.author.length === 0){
                                    this.setState({ name_err : true })
                                }else{
                                    this.setState({ name_err : false }) 
                                }
                                if(this.state.comment.length>0 &&  this.state.author.length>0){
                                this.toggleModal()
                                this.props.postComment(this.props.comments.comments.length,dishId,this.state.comment,this.state.author,this.state.rating,(new Date).toISOString())
                                }
                            }}
                            color='rgb(75,51,163)'
                            title="Submit"
                            buttonStyle={{backgroundColor:'rgb(75,51,163)',width:'95%',justifyContent:'center',alignItems:'center',marginLeft:'2.5%'}} 
                            />
                            <Text>{'\n'}</Text>
                        <Button 
                            onPress = {() =>{this.toggleModal(); this.setState({comment:'',author:'',rating:0,comment_err:false,name_err:false})}}
                            color="#512DA8"
                            title="Close"
                            buttonStyle={{backgroundColor:'#9e9e9e',width:'95%',justifyContent:'center',alignItems:'center',marginLeft:'2.5%'}}  
                            />
                    </View>
                </Modal>
        </>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        paddingTop: 40
     },
     modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        width:'100%',
        paddingTop:0,
        marginTop:0
     },
     modalText: {
        fontSize: 18,
        margin: 10
     },
    icons :{
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});