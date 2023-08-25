/* ***** John Hu **** This is my comments section

  Functionalities: 
  This is a drawing game that works on iOS and Andriod and allows users to draw whatever they want only on the canvas-the center white rectangle. On top of the canvas, there is a flatlist of settings. The first is a colorpicker, allowing the user to select whatever color for the pen.The second item is an eraser, which basically sets fill to none, color to white, and shapes to none. Next is the regular pencil, which basically allows the user to reset the settings: pen to black, strokewidth to 5, fill to none, and shape to none. Then there is the strokewidth settings: allowing the user to choose the width anywhere from 5 to 60 with intervals of 5 because intervals of 1 makes it difficult to slide to a specific width. The width applies in all components: the pen, eraser, fill, and shapes. Then there is the bucket, which is the fill. If the user chooses a fill color, then the app will also set the pen color to the fill color. If the user does not want the fill color, they must select the normal pencil so that the settings can reset. The last item is the shapes flatlist; it offers a straight line, a square, a circle, and an 'X' icon. When the straight line is selected, the app will only convert the current user stroke to an accurate straight line after the user lets go. For the square, the width is defined as the absolute value distance between the two x points, and the height is the distance between the two y points. So to make a square, the user needs to draw out something like an "L" shape. Defining the width and the height is enough to make a rectangle. On the other hand, the circle's diameter is defined as the absolute value distance between the y points. To make a circle, the user simply needs to draw a vertical line. The last option is the "X" icon, which goes back to the normal pen draw's "pointsToSvg" method.
  On the bottom of the screen, there is the undo button that undos and clear all button that clears everything on the canvas. 

  Issues:
  Sometimes the app can be very slow and glitchy; not sure where this is coming from. When I was drawing the andriod robot, sometimes the app took a few seconds to register my stroke. 
  For some reason, around the bottom 5% of the canvas cant be used. 

*/
import React, { useState, useEffect, useRef, } from 'react';
import ColorPicker from 'react-native-wheel-color-picker'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Pressable,
  Switch,
  ImageBackground,
  FlatList,
  StatusBar,
  Modal,
} from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';
import Pad from './components/view/pad';
import Pen from './components/tools/pen';
import Point from './components/tools/point';
import Slider, {SliderProps} from '@react-native-community/slider';

// width is not setting but slider is working
import { Card } from 'react-native-paper';


const Item = ({ item, onPress, backgroundColor, opacity, }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor, opacity]}>
    <Image
      source={item.title} //see if require works
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />

    <Text style={{ fontSize: 120 }}> {} </Text>
  </TouchableOpacity>
);
const ItemForShapes = ({ item, onPress, backgroundColor, opacity, }) => (
  <TouchableOpacity onPress={onPress} style={[styles.shapeStyle, backgroundColor, opacity]}>
    <Image
      source={item.title} //see if require works
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />

    <Text style={{ fontSize: 120 }}> {} </Text>
  </TouchableOpacity>
);


export default function App() {
  const [currColor, setCurrColor] = useState('black');
  const [currFill, setCurrFill] = useState('none');
  const [currType, setCurrType] = useState('none'); //see what shape or if on regular pen, false is regular, true is line
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdShapes, setSelectedIdShapes] = useState(null);
  const [modalVisibleColor, setModalVisibleColor] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [modalVisibleLines, setModalVisibleLines] = useState(false);
  const [modalVisibleFill, setModalVisibleFill] = useState(false);
  const [modalVisibleShape, setModalVisibleShape] = useState(false);
  const [currWidth, setCurrWidth] = useState(5);
  const [allImages, setAllImages] = useState([
    { title: require('./assets/colorPicker.png'), index: 0 },
    { title: require('./assets/eraser.png'), index: 1 },
    { title: require('./assets/pencil.png'), index: 2 },
    { title: require('./assets/lines.PNG'), index: 3 },
    { title: require('./assets/bucket.PNG'), index: 4 },
    { title: require('./assets/shapes.PNG'), index: 5 },
  ]);
  const [allShapes, setAllShapes] = useState([
    { title: require('./assets/straightLine.png'), index: 0 },
    { title: require('./assets/square.png'), index: 1 },
    { title: require('./assets/circle.png'), index: 2 },
    { title: require('./assets/X.png'), index: 3 },
  ]);
  const [allImagesStatus, setAllImagesStatus] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [allShapesStatus, setAllShapesStatus] = useState([
    false,
    false,
    false,
  ]);
  const [currNumSelected, setCurrNumSelected] = useState(0);
  const [currNumSelectedShapes, setCurrNumSelectedShapes] = useState(0);


  const clickedShapes = (index) => {
    if (currNumSelectedShapes < 1) {
      let tempAll = [...allShapesStatus];
      tempAll[index] = !tempAll[index];
      console.log(tempAll)

    if (tempAll[index]) {
      setCurrNumSelectedShapes(currNumSelectedShapes+1);
      setAllShapesStatus(tempAll);
      seeWhichItemShapes(index); 
      return true;
    } else {
      setCurrNumSelectedShapes(currNumSelectedShapes-1);
      setAllShapesStatus(tempAll);
      seeWhichItemShapes(index);
      return false;
    }
    }
    let tempAll = [...allShapesStatus];
    tempAll[index] = !tempAll[index];
    if (tempAll[index]) {
      for (let i = 0; i < tempAll.length; i++) {
        tempAll[i] = false;
      }
      setCurrNumSelectedShapes(0);
      setAllShapesStatus(tempAll);
      seeWhichItemShapes(index);
      return true;
    } else {
      setCurrNumSelectedShapes(currNumSelectedShapes-1);
      setAllShapesStatus(tempAll);
      seeWhichItemShapes(index);
      return false;
    }
  }

  const clicked = (index) => {
    if (currNumSelected < 1) {
      let tempAll = [...allImagesStatus];
      tempAll[index] = !tempAll[index];
      console.log(tempAll)

    if (tempAll[index]) {
      setCurrNumSelected(currNumSelected+1);
      setAllImagesStatus(tempAll);
      seeWhichItem(index);
      return true;
    } else {
      setCurrNumSelected(currNumSelected-1);
      setAllImagesStatus(tempAll);
      seeWhichItem(index);
      return false;
    }
    }
    let tempAll = [...allImagesStatus];
    tempAll[index] = !tempAll[index];
    if (tempAll[index]) {
      for (let i = 0; i < tempAll.length; i++) {
        tempAll[i] = false;
      }
      setCurrNumSelected(0);
      setAllImagesStatus(tempAll);
      seeWhichItem(index);
      return true;
    } else {
      setCurrNumSelected(currNumSelected-1);
      setAllImagesStatus(tempAll);
      seeWhichItem(index);
      return false;
    }
   
  }

  const cancel = () => {
    let temp = [...allImagesStatus];
    for (let i = 0; i < allImagesStatus.length; i++) {
      temp[i] = false;
    }
    setAllImagesStatus(temp);
    setModalVisibleShape(false);
  }

  const seeWhichItemShapes = (index) => {
    if (index == 0) {
      setCurrType("line");
    } else if (index == 1) {
      setCurrType("square");
    } else if (index == 2) {
      setCurrType("circle");
    } else if (index == 3) {
      setCurrType("none");
    } 
  }

  const seeWhichItem = (index) => {
    if (index == 0) {
      setModalVisibleColor(!modalVisibleColor);
    } else if (index == 1) {
      setCurrColor('white');
      setCurrFill('none');
      setCurrType('none');
    } else if (index == 2) {
      setCurrColor('black');
      setCurrFill('none');
      setCurrWidth(5);
      setCurrType('none');
    } else if (index == 3) {
      setModalVisibleLines(!modalVisibleLines);
    } else if (index == 4) {
      setModalVisibleFill(!modalVisibleFill);
    } else if (index == 5) {
      setModalVisibleShape(!modalVisibleShape);
    }
  }

  const setWidth = () => {
    setCurrWidth(sliderValue);
    setModalVisibleLines(false);
    let temp = [...allImagesStatus];
    temp[3] = false;
    setAllImagesStatus(temp);
  }

  const finishColor = () => {
      let tempArr = [...allImagesStatus];
      for (let i = 0; i < allImagesStatus.length; i++) {
        tempArr[i] = false;
      }
      setAllImagesStatus(tempArr);
      setCurrFill("none");
      setModalVisibleColor(false);
      setModalVisibleFill(false);
      setModalVisibleLines(false);
    }
    const finishFill = () => {
      let tempArr = [...allImagesStatus];
      for (let i = 0; i < allImagesStatus.length; i++) {
        tempArr[i] = false;
      }
      setAllImagesStatus(tempArr);
      setCurrColor(currFill);
      setModalVisibleColor(false);
      setModalVisibleFill(false);
      setModalVisibleLines(false);
    }


   const renderItem = ({ item }) => {

    let backgroundColor = '';
    let opacity = '';

    if (allImagesStatus[item.index]) {
      backgroundColor = 'purple';
      opacity = '100%';
    } else {
      backgroundColor = '#ecf0f1';
      opacity = '50%';
    }
   
    return (
      <Item
        item={item}
        onPress={() => clicked(item.index)}
        backgroundColor={{ backgroundColor }}
        opacity={{opacity}}
      />
    );
  };

  const renderItemShapes = ({ item }) => {

    let backgroundColor = '';
    let opacity = '';

    if (allShapesStatus[item.index]) {
      backgroundColor = '#89CFF0';
      opacity = '100%';
    } else {
      backgroundColor = 'white';
      opacity = '50%';
    }
   
    return (
      <ItemForShapes
        item={item}
        onPress={() => clickedShapes(item.index)}
        backgroundColor={{ backgroundColor }}
        opacity={{opacity}}
      />
    );
  };
  return (
    <View style={styles.container}>
        <Text> </Text>
      
      <FlatList
            data={allImages}
            numColumns={6}
            renderItem={renderItem}
            keyExtractor={(item) => item.index}
            extraData={selectedId}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleColor}
        onRequestClose={() => {
          setModalVisibleColor(!modalVisibleColor)
        }}
      >
      <View style ={{top: '15%'}}>
      <Card style={{backgroundColor:'#f2b8c6'}}>
      <TouchableOpacity onPress={() => finishColor()}>
          <Text
            style={{
              color: 'red',
              fontFamily: 'Cochin',
              textAlign: 'center',
              fontSize: 20,
            }}>
            Done
          </Text>
        </TouchableOpacity>
      <ColorPicker
					ref={r => { picker = r }}
					color={currColor}
					swatchesOnly={false}
					onColorChange={(color) => setCurrColor(color)}
					onColorChangeComplete={(color) => setCurrColor(color)}
					thumbSize={30}
					sliderSize={20}
					noSnap={true}
					row={false}
					swatchesLast={true}
					swatches={true}
					discrete={false}
				/>
        
      </Card>

      </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleLines}
        onRequestClose={() => {
          setModalVisibleLines(!modalVisibleLines)
        }}
      >
      <View style ={{top: '15%', alignItems: 'center'}}>
      <Slider
            style={{width: '90%', height: '10%'}}
            minimumValue={5}
            maximumValue={60}
            step = {5}
            minimumTrackTintColor="skyblue"
            maximumTrackTintColor="#022d36"
            value = {sliderValue}
            onValueChange={(text) => setSliderValue(text)}>
          </Slider>
          <Text style={{fontFamily: 'Cochin', fontSize: 15, textAlign: 'center'}}>Current stroke width: {sliderValue}</Text>

          <Text style={styles.buffer}> </Text>
          <TouchableOpacity onPress={() => setWidth()}>
          <Text
            style={{
              color: 'red',
              fontFamily: 'Cochin',
              textAlign: 'center',
              fontSize: 20,
            }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFill}
        onRequestClose={() => {
          setModalVisibleFill(!modalVisibleFill)
        }}
      >
      <View style ={{top: '15%'}}>
      <Card style={{backgroundColor:'#f2b8c6'}}>
      <TouchableOpacity onPress={() => finishFill()}>
          <Text
            style={{
              color: 'red',
              fontFamily: 'Cochin',
              textAlign: 'center',
              fontSize: 20,
            }}>
            Done
          </Text>
        </TouchableOpacity>
        <ColorPicker
					ref={r => { picker = r }}
					color={currFill}
					swatchesOnly={false}
					onColorChange={(color) => setCurrFill(color)}
					onColorChangeComplete={(color) => setCurrFill(color)}
					thumbSize={30}
					sliderSize={20}
					noSnap={true}
					row={false}
					swatchesLast={true}
					swatches={true}
					discrete={false}
				/>
      </Card>
      </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleShape}
        onRequestClose={() => {
          setModalVisibleShape(!modalVisibleShape)
        }}
      >
      <View style ={{top: '15%'}}>
        <FlatList
            data={allShapes}
            numColumns={6}
            renderItem={renderItemShapes}
            keyExtractor={(item) => item.index}
            extraData={selectedIdShapes}
        />
        <Text> </Text>
        <TouchableOpacity onPress={() => cancel()}>
          <Text
            style={{
              color: 'red',
              fontFamily: 'Cochin',
              textAlign: 'center',
              fontSize: 20,
            }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      </Modal>
      <Card style={{height: '75%', top: '-12%'}}>
      
      <Pad type={currType} width={currWidth} color={currColor} fill={currFill}/>
      </Card>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    height: '40%',
    width: '16.6%',
  },
  shapeStyle: {
    height: '40%',
    width: '25%',
  },
  buffer: {
    fontSize: 30,
  },
});