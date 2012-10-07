
(function(){

    // Two cell types, either alive or empty.
    // we could possibly change this in the future 
    // to track new and dead cells for prettier rendering
    const CELL_EMPTY = 0;
    const CELL_ALIVE = 1;

    //Store the drawing context
    var canvas = document.getElementById('life');
    var context = canvas.getContext('2d');

    //Keep our timer so we can pause and go
    var hTimer = null;

    //The life world is a grid, here are the dimensions
    var lifeWidth = 50;
    var lifeHeight = 50;
    var lifeWorldSize = lifeWidth*lifeHeight; //Total number of cells - used for out array

    //To calculate the cell drawing size. Might add a padding in future
    var cellWidth = canvas.width / lifeWidth;
    var cellHeight = canvas.height / lifeHeight;

    //Surrounding cell offsets. We use this to calculate the number
    //of surrounding cells later on
    var cellOffsets = {
	cellTopLeft: { "x":-1, "y":-1 },
	cellTop: { "x":0, "y":-1 },
	cellTopRight: { "x":1, "y":-1 },
	cellLeft: { "x":-1, "y":0 },
	cellRight: { "x":1, "y":0 },
	cellBottomLeft: { "x":-1, "y":1 },
	cellBottom: { "x":0, "y":1 },
	cellBottomRight: { "x":1, "y":1 }
    };

    //Initialise the array representing the life world
    var lifeWorldNow = new Array(lifeWorldSize);
    //The next generation of cells
    var lifeWorldNext = new Array(lifeWorldSize);

    //We want to keep our coordinates inside the grid.
    //It wraps to make it easy for cell neighbor calculations
    function normalizeCoordinates(x, y) {
	while (x < 0) {
	    x += lifeWidth;
	}
	while (y < 0) {
	    y += lifeHeight;
	}
	x = x % lifeWidth;
	y =y % lifeHeight;
	return {"x":x, "y":y};
    }

    //We want to keep our index safe as well
    function normalizeIndex(index) {
	while (index < 0) {
	    index += lifeWorldSize;
	}
	index = index % lifeWorldSize;
	return index;
    }

    //Origin and Offset are coordinates: {"x":number, "y":number}
    //origin is the absolute coordinate and offset is a relative coordinate
    //This calculates the cell position given an offset
    function calculateCellOffset(origin, offset) {
	var newX = origin.x + offset.x;
	var newY = origin.y + offset.y;
	var result = normalizeCoordinates(newX, newY);
	return result;
    }

    //Calculate the index into the array for a given cell coordinate
    function getCellIndex(x, y) {
	//Normalise the x and y co-ordinates.
	var coordinates = normalizeCoordinates(x, y);
	var result = (lifeHeight*coordinates.y)+coordinates.x;
	return result;
    }

    //Gives us the cell coordinate from an array index
    function getCellCoordinates(index) {
	index = normalizeIndex(index);
	var y = Math.floor(index/lifeWidth);
	var x = index-(y*lifeWidth);
	return { 'x':x, 'y':y };
    }

    //Initialise the world by filling it with random cells
    function initialise() {
	//First we'll randomise the world..
	for (var index=0; index < lifeWorldSize; index++) {
	    lifeWorldNow[index] = Math.round(Math.random());
	}
    }

    //The magic is here, calculate the next generation of cells.
    function calculateNextGeneration() {
	for (var index=0; index < lifeWorldSize; index++) { //Iterate over each cell by index
	    var currentCell = getCellCoordinates(index); //Get the current cell's coordinate
	    var cellNeighbors = 0; //Set the neighboring cell count to 0
	    for (var offsetIndex in cellOffsets) { //Go through each of the neigborung cells
		var cellOffset = cellOffsets[offsetIndex]; //Get the neighbors offset coordinate (relative)
		var neighborCell = calculateCellOffset(currentCell, cellOffset); //Now get it's absolute position
		var neighborIndex = getCellIndex(neighborCell.x, neighborCell.y); //Turn it into an index
		cellNeighbors += lifeWorldNow[neighborIndex]; //And add it's content to the neighbor cell count! 1 or 0 - may change in future if we want to track new/dead cells and we'll have to change this calculation too
	    }
	    //And now for the rules...
	    if (lifeWorldNow[index]==1) { //If the current generation has a live cell...
		if (cellNeighbors==2 || cellNeighbors==3) { //...and there are 2 or 3 neighbors
		    lifeWorldNext[index] = 1; //it survives :)
		}else {
		    lifeWorldNext[index] = 0; // otherwise it dies :(
		}
	    } else if (cellNeighbors==3) { //If a cell is empty but has exactly 3 neighbors
		lifeWorldNext[index] = 1; // A new cell is born!! :)
	    } else {
		lifeWorldNext[index] = 0; // Otherwise it remains empty
	    }
	}
	lifeWorldNow = lifeWorldNext.slice(); // Copy the object, not just the reference
    }

    //Draw the cell
    function drawCell(x, y, state) {
	context.save();
	context.strokeStyle = ((state==0)?"#FFFFFF":"#000000");
	context.lineWidth = ((state==0)?"2":"1");

	var x = x*cellWidth+(cellWidth/2);
	var y = y*cellHeight+(cellHeight/2);
	context.translate(x, y);
	context.beginPath();
	context.arc(0, 0, (Math.min(cellWidth, cellHeight)/2)-1, 0, 2*Math.PI, false);
	context.stroke();
	context.restore();
    }

    //Draw the whole world!
    function drawWorld() {
	for (var index=0; index < lifeWorldSize; index++) {
	    var coordinates = getCellCoordinates(index);
	    drawCell(coordinates.x, coordinates.y, lifeWorldNow[index]);
	}
    }


    function handleResize() {
        var width = $('#life').width();
        $('#life').attr('width', width);
        $('#life').attr('height', width);
        cellWidth = canvas.width / lifeWidth;
        cellHeight = canvas.height / lifeHeight;
        drawWorld();
    }

    //Initialise the world and draw it
    initialise();
    handleResize(); //To initialise the canvas size
    drawWorld();

    $(window).resize(handleResize);

    //Set up our button handlers
    $('#startStop').click(toggleRunning);
    $('#reset').click(resetAction);
//    document.getElementById('startStop').addEventListener('click', toggleRunning, true);
//    document.getElementById('reset').addEventListener('click', resetAction, true);

    //Reset the world by randomising it and drawing it again
    function resetAction() {
	initialise();
	drawWorld();
    }

    //Toggle the generation calculation
    function toggleRunning(e) {
	if (hTimer==null) { //The timer isn't running so...
	    hTimer = setInterval(function() { //Set up a new timer...
		calculateNextGeneration(); //...that calculates the next generation..
		drawWorld(); //...and draws it!
	    }, 5); // every second thanks
	    this.innerHTML = " Pause"; //Toggle the buttons label...
	    document.getElementById("reset").disabled = true; //And the resets enabled state
        $('#startStop').removeClass('icon-play');
        $('#startStop').addClass('icon-pause');
	} else { // BUT ... if we have a timer we are already running so...
	    clearInterval(hTimer); //...cancel the timer...
	    hTimer = null; //...and remember we have done so..
	    this.innerHTML = " Go"; //..update the label
	    document.getElementById("reset").disabled = false; //...and enabled the reset!
        $('#startStop').removeClass('icon-pause');
        $('#startStop').addClass('icon-play');
	}
    }

})();