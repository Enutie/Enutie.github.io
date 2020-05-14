# Components
The following components are available for the creation of interactive visualisations.

Albot, BST, cArray, cButton, Circle, CircleQueue, ContextMenu, cText, Link, Logger, Menu, TextArea

## Albot

Albot.js is the robot that speaks to the user. 

x_percentage : The x-position it is initialised with

y_percentage : The y-position it is initialised with

current_mood : sets which image face Albot is rendered with (happy, sad etc.)

speaking : a boolean, used to mark if he's currently speaking (used for async handling)

### addAlbot() :

generates Albot from different sub-components. Loads the image, adds it to the main div of the page, creates his speechbubble <p> 

Albot is also set at the initialised x and y position and given a little [on.click](http://on.click) effect that makes him say a little sound

### delete()

removes Albot from the canvas and stops whatever he's saying

### mood()

sets his current mood (used to define which image file to use)

### removespeechBubble()

fades the speechbubble away with a given fadeTimer

### async say()

The most comprehensive method of Albot. This method deletes the image of albot and replaces it with a new one, and feeds text and new screen coordinates to where he should be drawn. The text is displayed using TypeIt.js a library for creating the "typewriter" effect. At each character, Albot also says a corresponding sound in the alphabet. Characters not defined in the alphabet don't get pronounced, and they can simply be added to the audio files in the resources. One audio file per character. This gives Albot a speech sound similar to the animalese sounds in Animal Crossing.

### updateSpeechBubble()

Changes the size of the bubble based on the text provided by TypeIt. Dynamically changes the height based on length.

**Unhealthy methods that require refactoring below**

### response()

is the automated reaction to a specific level. Calls optimalTriesCalculator for a response that is based on how many clicks the user used to get the "success" of a level

### optimalTriesCalculator()

Calculates the amount of tries the user used for a level compared to how 'difficult' the level was.

### reaction()

Changes the face of albot based on the result of optimaltries

## cArray

The cArray is our own 'circle array' interactive visualisation of the array data structure.

size : number of elements of the array

cell_width : width of cell in pixels

cell_height : height of cell in pixels

array_data : content of array

x : x position (default to center of screen)

y : y position

z : z-index

color : cell color

static : interactive boolean

descriptor : title of array

name : array div name

g : the current 'g' in d3js

### delete()

fades the array out with a default transition speed

### addDataToArray()

appends an iterable data structure of circles to the cArrays internal array

### async addCircleToSortedArray()

inserts a circle to an array that is sorted to its correct position, and corrects the array to update the indexes of all elements to maintain sorting. It also animates the insertion. It is a recursive asynchronous function, it's async because it needs to wait for the last animation to finish, before going on again.

### makeGrid()

Is called as the cArray object is initialised, it pushes the data from the array into the grid structure of the visualisation. It manages all the created circles and makes sure they're all locked into their correct position. 

### setColor()

Changes the color of the arraycells

### setTransform()

Changes the position of the cArray object, used to make sure all child elements follow along.

### draw()

The div and css elements added to the canvas. In here the validity of the can also be checked (in regards to sorting), so it can be coloured accordingly.

## cButton

a circleButton, currently not used for anything other than a muting function.

## Circle

An overloaded circle class. As this is the main circle object used for all intractable circles.

value : the text written on the circle, used for all value-based purposes.

radius : the size of the circle in pixels

isNumberVisible : used for hidden values

isPlaceholder : boolean for null-pointer circles

isSuccessCircle : boolean for whether the circle is used for progression in a level

x : starting x position 

y : starting y position

cx : starting relative x position (used for animation)

cy : starting relative y position  (used for animation)

ele : boolean for this element being present on the canvas

z : z-index

locked_to_tree : used for binary search trees

nodeClicked : event handler for this particular circles 'onClicked'

isInteractable : boolean for interactivity

isRevealed : similar to isNumberVisible, but used for temporary displays (can be refactored)

highlighted : different styling for highlight effects

id : id used for unique identifier in different scenarios

name : usually the id accompanied by something else

validInBST : whether or not it can be inserted into a BST

left : children pointer used in binary search trees

right :  children pointer used in binary search trees

drawArrowToCircle : similar to highlight

current_mouseover : mouseover event

current_mouseout : mouseout event

### click() [//Should](//should) be removed

triggers onClicked for the current d3js object

### delete()

Removes the circle from the canvas

### onNodeClicked()

calls defaultClicked() if the circle isn't a placeholder and is interactable.

### defaultClicked()

Counts the number of operations up by one and also updates the operation text

### convert()

used to define the name of the circle

### setTransform()

updates the current d3js transform for this circle

### mouseover()

mouseover for Circle objects

### mouseout()

mouseout for Circle objects

## CircleQueue

A queue of Circle objects, currently used for slow, visual insertion into other data structures

circles : the circles contained in the queue

parent : the container of the queue, not necessarily defined, but used for position updating of all circles

### pop()

removes the next element in the queue (dequeue)

### push()

Adds a circle to the queue (enqueue)

### updatePositions()

updates the visual positions of all circles after each operation of pop and push

## ContextMenu

The menu options given when right-clicking a circle. It contains one exported function used to manipulate either a BST Data structure or a circles inner data.

## cText

Text objects used for interactive visualisations. 

text : The text content

x : initial x position

y : initial y position 

z : z-index

fontSize : the fontsize of the text, defaults to 18

opacity : opacity, defaults to not set.

### delete()

removes the cText from the canvas by deleting it's .ele property

### draw()

paints the element (and deletes the old text, in the case of it updating since last draw)

### setText()

sets the text content of the cText object

## Link

A Link object is a line drawn between two other objects, usually Circle objects. It can be cut and appended.

### delete()

removes the cText from the canvas by deleting it's .ele property

### draw()

Draws the object in between the objects it exists between, also adds event handlers.

## Logger

The logger logs all user input and handles the displaying of method calls in the program. Can be used to see how long a user took to solve a certain task

op_list : the list of strings that describe the last operations the user made.

x : initial x position

y : initial y position

text_height : height of each line of text

font_size : font size of the text

row_count : number of lines displayed, any more get pushed out of view

extended_row_count : extra rows temporarily saved

extended_rows : boolean for whether extra rows should be on or off

timeWhenLastOp : time keeping for how fast the operations are being fed to the logger

currentCombo : combo meter for the optional combo display

COMBO_TIMEOUT : reset timer for the combo display

svg : the svg canvas of the application

### delete()

removes the Logger from the canvas by deleting it's .ele property

### addOp()

Logs the last operation the user did, updates the combo and redraws the Logger

### draw()

repaints the Logger and updates the text for the combo meter

### comboTextSize()

changes the font of the combo display based on how good the combo is 

## Menu

A menu used to describe and set handlers for different keys that the user can use to manipulate elements of the program. Muting sound, for example.


## TextArea.js
The TextArea component is used for assignments requiring the user to edit existing code, or inputting new.

The constructor takes a list of objects called "code". These are objects which has the properties: text and editable. Which determines what the content for that line is, and if the user can change it. 

## draw()
In it's draw method, it creates a div element, which holds a code HTML element. This is used to insert the code. The lines of text are created from the field "code". 

## convertInputToCode(str)
This is the function which reads the lines from the HTML code block, and adds lines of code before and after to ensure that the BST.js can it use it as an insert method with the "eval()" function.

## clickedExecuteCode()
This function is called when the user presses the button "Run code". It clears the stage of all drawable figures, and recreates the level with the users edited insert method.

## BST
This class is responsible for the BST visualization, by using the circles attached to it. It doesn't create the circles that are a part of the BST, but is a skeleton for them. It draws the links and sets the circles positions, and create the null pointer if the circle has "missing" children.

To be able to manipulate the circles, depending on if they are in a BST or not. All circles have a field: "locked_to_tree". The D3.js force-layout uses that field to check whether the circles should be attracted to their own x and y positions, or the x and y generated by the BST they belong to.


The class has the functionality, for both a regular BST and also a RB-BST. Therefore when using the class, remember to use the balanced methods when using a RB-BST, and use the unbalanced methods when using a vanilla BST. Except for the find method, which is identical for both types of BST.


### constructor(root)
The constructor takes a circle as a parameter which is used to set the root circle. If the parameter is not defined, the root becomes a null reference (this is only used in the sandbox mode).

### updateOnClick(c) 
Is used by the LevelHandler, in the exercise levels: "find", "insert" and "delete" in a bst. This function is given to all the circles in the BST, such that when they are clicked they have a new behaviour which interacts with the tree. 

When clicking on an interactable node, the pointer jumps to that node, and it's children and parent is set to interactable. This is used to visualize the user traversing the tree, similarly to how the computer traverses the tree. This function also calls the LevelHandler to check if the current state of the level, is that it is complete.

### updateOnClickForInsertion(c)
Nearly identical to the updateOnClick(c) method, except it updates the position of the node that is to be inserted. 

### contains(circle, h)
A recursive function that traverses the tree, and returns true if the tree contains the circle. Returns false if it hits a null reference. __Only works on a valid BST__. 

### createPlaceholderChildren(node, bst)
Function for creating placeholder nodes, and sets the parent of the placeholder to be node.

The following functions are for the regular BST.

### publicFind(h)
The public method for finding nodes in the BST. Based on the algorithm: https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html, but added some functionality to work with the rest of the program

### find(h, value)
The indirect private method of find. It is a recursive function which traverses the tree, trying to find a circle which has the value, "value".

It is an async function, which is done to allow for the animation, to show the user how the find works.

### publicInsert(node, root)
Public method used for inserting nodes into the BST. Based on the algorithm: https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html, but added some functionality to allow for animating the steps of the program.

### insert(node, h)
Read the description for publicInsert. 

### publicDelete(h, value)
Public method used for deleting node from the BST. Based on the algorithm: https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html. Added some functionality that allows for animating the steps the algorithm.

### delete (node, value)
Read description for publicDelete.

The following functions are designed for the Red Black BST.

### isRed(n) 
Code used for balancing a Red Black Binary Search Tree taken from Algorithms 4 book. For more information go to https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html

### rotateLeft(h)
Code used for balancing a Red Black Binary Search Tree taken from Algorithms 4 book. For more information go to https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html

### rotateRight(h)
Code used for balancing a Red Black Binary Search Tree taken from Algorithms 4 book. For more information go to https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html

### flipColors(h)
Code used for balancing a Red Black Binary Search Tree taken from Algorithms 4 book. For more information go to https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html


### publicBalancedInsert(node, root)
Public method used for inserting nodes into the BST. Based on the algorithm: https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html, but added some functionality to allow for animating the steps of the program.

### balancedInsert(node, h)
Read the description for publicInsert. 

### publicBalancedDelete(h, value)
Public method used for deleting node from the BST. Based on the algorithm: https://algs4.cs.princeton.edu/33balanced/RedBlackBST.java.html. Added some functionality that allows for animating the steps the algorithm.

To properly animate the balanced delete method, we added some few hacks, which surely can be implemented better. But it was very hard to figure out a way how to animate the different functions while still being in the recursive call of those functions.

### balancedDelete (node, value)
Read description for publicDelete.


### insertWithCustomCode(node, root)
This is an insert method which is used by the coding assignments. It uses d3 to find the class ".textarea" and gets the user written code from that. Then uses "eval()", to call the functions.

### dir(index) 
Used to verbalize the index of an element in a list, if 0 then left child, if 1 then right child. This is used when the user has done something, which creates an operation.

### recLockToTree(c, tree)
This function sets "c.locked_to_tree = tree". Then recursively calls itself, on c's children.

### addChild (child, parent, index)
This is used when a circle is added to the BST, without using the insert methods. This is called when the user drags a circle on top of a placeholder node (taking that null pointers position).

### removeChild (child, parent)
This is used when a circle is removed from a BST, without using the delete methods. This is used when a link is cut by the user, and the circle therefore have to get dettached from the BST.

### removeLink(link)
This is used to remove the link between two circles connected in the BST. This is called when the user cuts a link with the ScissorTool.

### updateLinks(link) 
This function should be called whenever the BST must be repainted, and it's structure has changed since the last repaint. It traverses the circles using their "left" and "right" field, and adds that as a field: "children = [left, right]". This is done so the that the d3.hierarchy() can be used to gain information about the tree. This function calls updateForces(), which used to affect the "simulation" forces.

### updateForces() 
Generate the tree data with "d3.hierarchy(this.root)". Calls updateTreePositions afterwards

### updateTreePositions()
Creates a treemap to control how the BST is visualized. Changing numbers in this function, will heavily affect how the tree appears. Afterwards it updates all nodes tree_x and tree_y, 
which is used by the simulation of the nodes.

### isValid() 
Checks if the BST is valid, and highlights all the unvalid nodes. This is currently not being used anywhere in the program.

### setTransform(x, y) 
Is used when the entire tree must be moved. It updates the x and y positions, and calls updateForces()

### draw()
This set links to be the d3tree.links().

### cutLink(d)
Is used by the lines, to handle when they cut.