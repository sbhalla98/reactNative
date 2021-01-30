import React from 'react';
import { Card } from 'react-native-elements';
import {DISHES} from '../shared/dishes';
import * as Animatable from 'react-native-animatable';
import { Text, View, ScrollView, FlatList,Modal,StyleSheet,Alert,PanResponder } from 'react-native';
import { COMMENTS } from '../shared/comments';
import {Icon,Input,Button} from 'react-native-elements';
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
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled
            />
        </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    handleViewRef = ref => this.view = ref;
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                {...panResponder.panHandlers}  ref={handleViewRef}>
                <Card>
                    <Card.Title>{dish.name}</Card.Title>
                    <Card.Image source={dish.name === 'Uthappizza' ? require('./images/uthappizza.png') : dish.name === 'Zucchipakoda' ? require('./images/zucchipakoda.png') :dish.name === 'Vadonut' ? require('./images/vadonut.png') : require('./images/elaicheesecake.png') }></Card.Image>
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
                </Animatable.View>
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