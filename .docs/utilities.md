# Utilities

Utilities is a folder containing functions, classes and variables that multiples files use throughout the entire project. Some of the files are also open source software, which we use for the project. It is divided into the following files:

## Colors.js

Contains the different color schemes for the circles, and the array of possible background colors.

## helper_functions.js

Contains mathematical functions and some prototype functions. This is done to reduce code redundancy, and make code more manageable to read.

### sameSign(a,b)
Returns true if a and b are both positive or both negative, returns false otherwise.

### lineIntersect (x1, y1, x2, y2, x3, y3, x4, y4)
Returns true if line(x1, y1, x2, y2) intersects with line(x3, y3, x4, y4), otherwise it returns false. This is used by the ScissorTool class, to see if the line drawn by the user, intersect with a Link. 

### asyncForEach(array, callback)
This is a function which allows for a forEach loop to await for the function to finish, before starting the function with subsequent element. This is used when animating stuff, such as inserting N amount of nodes in a BST or an array.

### getLength(number)
Returns the number of character needed to represent number as a string. This is used by the CircleManager, when setting the font-size of the circles values.

### piyg
This is a function which returns a color based on the input (expects 0-1). This is used by the ScissorTool for coloring the path. 

### timeout(ms)
This function is used as a fast way of making a timeout in an asynchronous function, e.g.: "await timeout(1000)" awaits 1 second before continuing. This is used in the animation of levels (BSTLevelHandler.js) and for the animation of the insert, delete, find and more in BST.js.

### createRandomPointOnCircumference(center, radius)
Returns a random point on the circumference of a circle (as [x, y]), which is defined by the parameters: center and radius.

## d3-context-menu.js
This is an open-source software, which has a custom context-menu which is implemented with D3.js.

