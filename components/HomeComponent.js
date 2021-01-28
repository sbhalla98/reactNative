import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';

import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
  }


function RenderItem(props) {
    
    const item = props.item;
    if (props.isLoading) {
        return(
                <Loading />
        );
    }
    else if (props.errMess) {
        return(
            <View> 
                <Text>{props.erreMess}</Text>
            </View>
        );
    }
    else{
    
    if (item != null) {
        return(
            <Card
                featuredTitle={item.name}
                featuredSubtitle={item.designation}
                image={require('./images/uthappizza.png')}>
                <Card.Title>{item.name}</Card.Title>
                {console.log(item.image,'no')}
                <Card.Image source={require('./images/uthappizza.png')}></Card.Image>
                <Text style={{margin: 10}}>{item.description}</Text>
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dishes: DISHES,
          promotions: PROMOTIONS,
          leaders: LEADERS
        };
    }

    static navigationOptions = {
        title: 'Home',
    };

    render() {

        return(
            <ScrollView>
                <RenderItem item={this.state.dishes.filter((dish) => dish.featured)[0]} isLoading={this.props.dishes.isLoading}
                    erreMess={this.props.dishes.erreMess}/>
                <RenderItem item={this.state.promotions.filter((promo) => promo.featured)[0]} isLoading={this.props.dishes.isLoading}
                    erreMess={this.props.dishes.erreMess} />
                <RenderItem item={this.state.leaders.filter((leader) => leader.featured)[0]} isLoading={this.props.dishes.isLoading}
                    erreMess={this.props.dishes.erreMess} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);