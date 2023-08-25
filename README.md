# Painter App 

**Web, IOS, & Andriod. This app was created using Expo.**

This is a drawing game that works on iOS and Andriod and allows users to draw whatever they want only on the canvas-the center white rectangle. On top of the canvas, there is a flatlist of settings. The first is a colorpicker, allowing the user to select whatever color for the pen.The second item is an eraser, which basically sets fill to none, color to white, and shapes to none. Next is the regular pencil, which basically allows the user to reset the settings: pen to black, strokewidth to 5, fill to none, and shape to none. Then there is the strokewidth settings: allowing the user to choose the width anywhere from 5 to 60 with intervals of 5 because intervals of 1 makes it difficult to slide to a specific width. The width applies in all components: the pen, eraser, fill, and shapes. Then there is the bucket, which is the fill. If the user chooses a fill color, then the app will also set the pen color to the fill color. If the user does not want the fill color, they must select the normal pencil so that the settings can reset. The last item is the shapes flatlist; it offers a straight line, a square, a circle, and an 'X' icon. When the straight line is selected, the app will only convert the current user stroke to an accurate straight line after the user lets go. For the square, the width is defined as the absolute value distance between the two x points, and the height is the distance between the two y points. So to make a square, the user needs to draw out something like an "L" shape. Defining the width and the height is enough to make a rectangle. On the other hand, the circle's diameter is defined as the absolute value distance between the y points. To make a circle, the user simply needs to draw a vertical line. The last option is the "X" icon, which goes back to the normal pen draw's "pointsToSvg" method.
  On the bottom of the screen, there is the undo button that undos and clear all button that clears everything on the canvas. 
  
  Issues:
  Sometimes the app can be very slow and glitchy; not sure where this is coming from. When I was drawing the andriod robot, sometimes the app took a few seconds to register my stroke. 
  The bottom 5% of the canvas cant be used. 

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo-cli](https://docs.expo.io/get-started/installation).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.io/c/snack).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).
