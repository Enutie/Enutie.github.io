# Handlers

There are seven different handlers that each have different responsibilities.

The following handlers are:

## AudioHandler

AudioHandle is responisible for the audio in the application, to play a sound the *play(sound)* function is called, with the *sound* is the name of the sound file needed. To add a new sound you have to add it to the res/sounds folder. the function takes care of the file type, so it is only needed to give the name as an argument.

## BSTLevelHandler

This is our story mode handler. If perhaps another datastructure would be desired to animate, there should be created a new class named *datastructureHandler*, KDTreeHandler for example. 

BSTLevelHandler is responsible for the content of the story mode. 

To add a new level you have to type *new level ()* and all content within the parentheses.  

The content should be properties as data structure name("circle", "array" etc.), objective of the level("Introduction", "Find", etc.), then a function that handles what Albot need to say and what the content of the level should be. Furthermore another function is needed to determine the success criteria of the level and lastly a function for Albot's finishing statements of the level. 

## Camera

This class is responsible for what the user can see in the application, movement of it and zooming.

## EventHandler

EventHandler handles input from the user from either they keyboard or mouse. It handles what should happen if a node is clicked. 

*setupKeyEvents* estrablish the main control shortkeys, such as *m* for mute/unmute music *r* for resetting camera etc. 

*dragged(d)* sets up what should happen when something is dragged, which then can be called by the BSTLevelHandler. 

*dragended(d)* determines what should happen when the dragging event is over.

## CircleManger, cButtonManager and LinkManager
Intuititively a class instance would be responsible for drawing itself, and a list of class instances, with a draw(), could be iterated to draw/redraw all the figures. But to harness the power of D3.js join selectionk, all objects of the same class must be in one list, and can thereafter be used with the join-selection method. This allows for doing specific actions, when objects are created, updated and deleted. We implemented this as a class called a manager, for each of the objects in need of a manager. The managers are also responsible for assigning events to the class instances, such as on "click", "mouseover" and "mouseout".

### CircleManager
This is the largest class of the managers, since every single SVG element needed to create the circle needs their join-selection method. But this allows us to animate the circles on enter and exit. 

### cButtonManager 
Nothing special to add, if you have read the general manager description ^.

### LinkManager 
Nothing special to add, if you have read the general manager description ^.

## DataHandler 
The DataHandler is used for calling functions that quickly can create required figures. It's communicates with the Logger which operations the user has performed. It holds all objects that don't have a Manager class, the BST and the array.

### Early development
Earlier in development the DataHandler was responsible for drawing/redrawing all the figures on the screen. Since some of those drawable classes were moved into their Managers, the DataHandler now only has responsibility for some of these classes (such as BST, and arrays).

The DataHandler was also responsible for also creating all the levels based on an JSON file describing the content of the level. This idea was changed into the LevelHandler concept, which allowed us to have more control of unique animations for each level.

## SimulationHandler
The SimulationHandler is responsible for invoking the draw method, the D3.js force-layout, and the ticked update of the SVG elements position.

### simulation
This is an instance of the D3.js force-layout. This is used to simulate physics for the circles. All classes can access this by importing the variable.

### CappedFPSTicked
This function is used to limit the calls to the function that D3.js force-layout uses to update the nodes. At the moment the simulation is capped at 60 frames per second.  

### ticked
This is the function which is used to update the positions of SVG elements affected by dragging or the force-layout. This is called by the CappedFPSTicked function.

### repaint
This function redraws all class which has a draw method, and reselects all svg elements that need to have their positions update by the ticked function. Also calls camera.reFocus().
