import { StatusBar } from 'expo-status-bar';
import React,{ useState,useEffect } from 'react';
import { StyleSheet,Text,View,FlatList,TextInput,Keyboard,TouchableOpacity,TouchableHighlight,ScrollView,Animated} from 'react-native';
import DraggableFlatList from "react-native-draggable-flatlist";
import Icon from 'react-native-vector-icons/FontAwesome';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

import SwipeableItem, { UnderlayParams } from 'react-native-swipeable-item';
export default function MyListItem() {
  const [tasks,setTasks]= useState('');
  const [done,setDone]= useState(false);
  const [tasksList,setTasksList]= useState([]);
  const [t,setT]= useState(false);
  const [isDrag,setDrag]= useState(false);
  const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,
   
    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage
   
    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,
   
    // cache data in the memory. default is true.
    enableCache: true,
   
    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
      // we'll talk about the details later.
    }
  });
  
 
  const add = () => {
    setTasksList(tasksList.concat([{key:Math.random(),value:tasks}]));
    setTasks('')
    setDone(true);
  }
  useEffect(()=>{
    // storage.remove({
    //   key: 'tasks',
    //   id: '1001', 
    // })
    if(t){
    storage.save({
      key: 'tasks', // Note: Do not use underscore("_") in key!
      id: '1001', // Note: Do not use underscore("_") in id!
      data: tasksList,
      expires: null
    });
    }
    else{
      setT(true);
      storage
      .load({
        key: 'tasks',
        id: '1001'
      })
      .then(ret => {
        // found data goes to then()
        if(ret){
        setTasksList(ret)
        }
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        switch (err.name) {
          case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });
    }
  },[tasksList])
  const NUM_ITEMS=20;
  function getColor(i) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
  }
  const initialData = [...Array(20)].fill(0).map((d, index) => {
    const backgroundColor = getColor(index);
    return {
      text: `Row ${index}`,
      key: `key-${backgroundColor}`,
      backgroundColor,
      height: 100,
    };
  });
  const deleteItem = (item)=>{
    const updatedData = tasksList.filter((d) => d !== item);
    // Animate list to close gap when item is deleted
   // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTasksList(updatedData);
  }
  const renderUnderlayLeft = ({ item, percentOpen }) => (
    <Animated.View
      style={[styles.row, styles.underlayLeft]} // Fade in on open
    >
      <TouchableOpacity >
    <Text  onPress={()=>deleteItem(item)}
    style={{color:'white',fontSize:20}}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const OVERSWIPE_DIST = 50;
  const  itemRefs = new Map();
  const renderItem = ({ item, index, drag, isActive }) => {
    return ( 
      <SwipeableItem
        key={item.key}
        item={item}
        ref={(ref) => {
          if (ref && !itemRefs.get(item.key)) {
            itemRefs.set(item.key, ref);
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={renderUnderlayLeft}
        snapPointsLeft={[80]}
        onPressIn={()=>setDrag(true)}
        swipeEnabled={ isDrag ? false : true}
        >
        <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#ffca28" : item.backgroundColor,
        }}
        onLongPress={drag}
      >
      <View style={[0,1,2].includes(index) ? styles.div : styles.divnp} >
      <Text style={styles.item}>{''}{[0,1,2].includes(index) ? <Icon name="circle" size={16} color="#ffca28" /> : '  '}
      {'  '}{item.value}</Text>
      </View>
      </TouchableOpacity>
      </SwipeableItem>
    );
  };
  return (
  <>
  <View style={styles.body}>
  <TextInput style={styles.input} placeholder=" Enter your task to do" 
      onChangeText={(e)=>{
        if(!done){
        setTasks(e)
        }
      }} 
      value={tasks} 
      onKeyPress={(event) => {
        if(event.nativeEvent.key == 'Enter'){
          Keyboard.dismiss();
          add(event)
        }
      }} 
      numberOfLines={1}
      onFocus={()=>{
        setDone(false);
      }}
      multiline={true}>
    </TextInput>
    <View style={styles.container}>
      {tasksList.length === 0 && <Text style={{marginTop:'50%',padding:60}}>You haven't added anything yet to your to do list...</Text>}
      <DraggableFlatList
          data={tasksList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => {setTasksList(data); setDrag(false)}}
          activationDistance={20}
        />
      <StatusBar></StatusBar>
    </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
    backgroundColor:'white',
    marginBottom:10
  },
  item:{
    width:'98%',
    color:'red',
    padding:5,
    fontSize:30,
    borderWidth:1,
    margin:2,
    borderColor:'#b0bec5',
    zIndex:100,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    shadowColor: '#263238',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor:'#fafafa',
    marginBottom:2
  },
  div:{
    width:'100%',
    textAlign:'left',
    margin:2,
  },
  divnp:{
    width:'100%',
    textAlign:'left',
    margin:2
  },
  body:{
    //backgroundColor:'white',
    height:'100%'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderRadius:5,
    backgroundColor:'white',
    borderColor:'#b0bec5',
    fontSize:20,
    marginTop:70,
    paddingLeft:15,
    shadowColor: '#263238',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    //height:40
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 32,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: '#e53935',
    justifyContent: 'flex-end',
    width:'49%',
    marginLeft:'50%',
    marginRight:'10%',
    marginTop:4,
    marginBottom:3,
    color:'white'
  },


});
