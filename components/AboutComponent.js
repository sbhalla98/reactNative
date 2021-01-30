import React from 'react';
import { FlatList ,Text,ScrollView} from 'react-native';
import { ListItem , Avatar} from 'react-native-elements';
import { Card } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      leaders: state.leaders
    }
  }


function History() {
    return (
    <Card featuredTitle={'Our History'}>
    <Card.Title>{'Our History'}</Card.Title>
    <Card.Divider/>
    <Text style={{margin: 10}}>
    Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong.
    With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
    The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
    </Text>
    </Card> 
    )
}


class About extends React.Component{


    static navigationOptions = {
        title: 'About Us'
    };


    renderMenuItem = ({item, index}) => {
        const { navigate } = this.props.navigation;
        return (
                <ListItem
                    key={index}
                    onPress={() => navigate('Menu', { screen:'DishDetail',params :{ dishId: item.id }})}
                  >
                       <Avatar source={require('./images/logo.png')} rounded />
                        <ListItem.Content>
                        <ListItem.Title>{item.name}</ListItem.Title>
                        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                        </ListItem.Content>
                  </ListItem>
        );
    };

    render(){
        if (this.props.leaders.isLoading) {
            return(
                <ScrollView>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        else if (this.props.leaders.errMess) {
            return(
                <Animatable.View animation="fadeInDown" duration={1000} delay={1000} >
                <ScrollView>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                        <Text>{this.props.leaders.errMess}</Text>
                    </Card>
                </ScrollView>
                </Animatable.View>
            );
        }else{

            return (
            <>
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} >
            <ScrollView>
            <History />
            <Card featuredTitle={'Our History'}>
            <Card.Title>{'Corporate Leadership'}</Card.Title>
            <Card.Divider/>
            <FlatList 
                data={this.props.leaders.leaders}
                renderItem={this.renderMenuItem}
                keyExtractor={item => item.id.toString()}
                ScrollView
                />
            </Card>
            </ScrollView>
            </Animatable.View>
            </>
            );
        }

    }
}

export default connect(mapStateToProps)(About);