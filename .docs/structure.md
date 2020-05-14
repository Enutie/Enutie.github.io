# Structure

While Algorithms with Albot was created as a Bachelor project that showcases interactive visualisation for Binary Search Trees,
it is also programmed in a way that makes it easy to create new "story-modes" for other type of data structures.
AwA consists of many parts and is abstractly divided into a story-mode creation layer, and a modules-layer.


## index.html 
The program runs from index.html where it loads the "SceneLoader.js". In here we have predefined the Binary Search Tree levels as the "story mode", other story modes can just replaced in here, to change what needs to be taught. 

## Story layer
The story layer, is the part of the code where you can create a new story mode, or manipulate and change the already existing story modes. 
To create a story, create an html document that has the "SceneLoader.js" javascript file loaded in a script tag, and from there use a new 
script tag to add each level of the story. You can see "BSTLevelHandler.js" for an example of how to create a "story".

## Parts layer
The parts layer is the behind-the-scenes javascript files that use d3js, define objects, algorithms, different handlers, and the 
interaction between these parts. The SceneLoader.js file is the glue that holds everything together, using the ES6 module structure
to import the different files and create them appropriately.
The Parts layer is divided into Components, Utilities, Handlers and the rest are floating above on the root layer.

### Dreams of React
The way AwA handles scenes and states could be vastly improved upon by a framework such as [React](https://reactjs.org/). 
