import * as React from 'react';
import ColorPicker from 'react-native-wheel-color-picker'
import {
  View,
  PanResponder,
  StyleSheet, 
  Text,
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
} from 'react-native'
import Svg, { G, Path, Circle, Rect } from 'react-native-svg';
import Pen from '../tools/pen'
import Point from '../tools/point'

export default class Pad extends React.Component {

  constructor(props) {
    super()
    this.state = {
      currentColor: 'silver',
      currentStrokeWidth: 55,
      tracker: 0,
      currentPoints: [],
      previousStrokes: [],
      pen: new Pen(),
      currentFill: 'none',
      currentShape : 'none',
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    })
    const rewind = props.rewind || function () { }
    const clear = props.clear || function () { }
    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
    }

  }

  componentDidMount () {
    if(this.props.strokes)
      this.setState({strokes: this.props.strokes})
  }

  componentDidUpdate () {
    if(this.props.enabled == false && this.props.strokes !== undefined && this.props.strokes.length !== this.state.previousStrokes.length)
      this.setState({ previousStrokes: this.props.strokes || this.state.previousStrokes })
  }

  rewind = () => {
    if (this.state.currentPoints.length > 0 || this.state.previousStrokes.length < 1) return
    let strokes = this.state.previousStrokes
    strokes.pop()

    this.state.pen.rewindStroke()

    this.setState({
      previousStrokes: [...strokes],
      currentPoints: [],
      tracker: this.state.tracker - 1,
    })

    this._onChangeStrokes([...strokes])
  }

  clear = () => {
    this.setState({
      previousStrokes: [],
      currentPoints: [],
      tracker: 0,
    })
    this.state.pen.clear()
    this._onChangeStrokes([])
  }

  onTouch(evt) {
    if (this.props.enabled == false) return;
    let x, y, timestamp, color, width, fill, type
    [x, y, timestamp, color, width, fill, type] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.timestamp, this.props.color, this.props.width, this.props.fill, this.props.type]

    let newCurrentPoints = this.state.currentPoints
    newCurrentPoints.push({ x, y, timestamp, color, width, fill, type })

    this.setState({
      previousStrokes: this.state.previousStrokes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker
    })
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let strokes = this.state.previousStrokes
    if (this.state.currentPoints.length < 1) return

    var points = this.state.currentPoints

    this.state.pen.addStroke(this.state.currentPoints)

    this.setState({
      previousStrokes: [...strokes, points],
      strokes: [],
      currentPoints: [],
      tracker: this.state.tracker + 1,
    })
    this._onChangeStrokes([...strokes, points])
  }

  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  }

  _onChangeStrokes = (strokes) => {
    if (this.props.onChangeStrokes) this.props.onChangeStrokes(strokes)
  }

  render() {
    var props = this.props.enabled != false ? this._panResponder.panHandlers : {}

    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.drawContainer,
          this.props.containerStyle,
        ]}>
        
        <View style={styles.svgContainer} {...props}>
          <Svg style={styles.drawSurface}>
            <G>
              {this.state.previousStrokes.map((e) => {
                var points = [];
    
                if (e[0].type == "none") {
                  for (var i in e) {
                    let newPoint = new Point(e[i].x, e[i].y, e[i].timestamp, e[i].color, e[i].width, e[i].fill, e[i].type)
                    points.push(newPoint)
                    console.log(e[i].type)
                  }
                
                return (<Path
                  key={e[0].timestamp}
                  d={this.state.pen.pointsToSvg(points)} 
                  stroke={e[i].color}
                  strokeWidth={e[i].width}
                  fill={e[i].fill}
                />)
                  }

                if (e[0].type == "line") {
                  for (var i in e) {
                    let newPoint = new Point(e[i].x, e[i].y, e[i].timestamp, e[i].color, e[i].width, e[i].fill, e[i].type)
                    points.push(newPoint)
                  }

                return (<Path
                  key={e[0].timestamp}
                  d={this.state.pen.pointsToLine(points)} 
                  stroke={e[i].color}
                  strokeWidth={e[i].width}
                  fill={e[i].fill}
                />)
                }

                if (e[0].type == "circle") {
                  return (<Circle cx={e[0].x} cy={e[0].y} r={Math.abs((e[0].y-e[e.length-1].y)/2)} stroke={e[0].color} strokeWidth={e[0].width} fill={e[0].fill} />)
                }
                if (e[0].type == "square") {
                  return (<Rect x={e[0].x} y={e[0].y} width={Math.abs(e[0].x-e[e.length-1].x)} height={Math.abs(e[0].y-e[e.length-1].y)} stroke={e[0].color} strokeWidth={e[0].width} fill={e[0].fill}/>)
                }
                

              }
              )
              }
              <Path
                key={this.state.tracker}
                d={this.state.pen.pointsToSvg(this.state.currentPoints)}
                stroke={this.props.color || this.state.currentColor}
                strokeWidth={this.props.width}
                fill={this.props.fill || this.state.currentFill}
              />
            </G>
          </Svg>

          {this.props.children}
          </View>
          
          <View style={[styles.touchableContainer, {top: '10%', backgroundColor: '#ecf0f1',}]}>
           
          
          <TouchableOpacity onPress={() => this.rewind()}>
            <Text> </Text>
            <Text
              style={{
                color: 'cyan',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Undo
              <Text style={{ color: 'red' }}> ↺</Text>
            </Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity onPress={() => this.clear()}>
            <Text> </Text>
            <Text
              style={{
                color: 'cyan',
                fontFamily: 'Cochin',
                textAlign: 'center',
                fontSize: 20,
                width: '100%',
              }}>
              Clear All
              <Text style={{ color: 'red' }}> ♻</Text>
            </Text>
          </TouchableOpacity>
          
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',
  },
  svgContainer: {
    flex: 1,
  },
  drawSurface: {
    flex: 1,
  },
  touchableContainer: {
    height: '8%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
})