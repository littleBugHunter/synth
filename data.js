
////////////////////// COLOR GRID ////////////////////

var GRID_WIDTH = 8;
var GRID_HEIGHT = 8;
var colors = [];

class ButtonColor
{
	constructor(r = 0, g = 0, b = 0, intensity = 1)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.intensity = intensity;
		this.flash = 0;
	}
	componentToHex(c)
	{
		var hex = Math.min(Math.floor(c*255),255).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	getHexColor()
	{
		return "#" + this.componentToHex(this.r * this.intensity + this.flash) + 
					 this.componentToHex(this.g * this.intensity + this.flash) + 
					 this.componentToHex(this.b * this.intensity + this.flash);
	}
}

for(var i = 0; i < GRID_WIDTH; ++i)
{
	colors[i] = [];
	for(var j = 0; j < GRID_WIDTH; ++j)
	{
		colors[i][j] = new ButtonColor();
	}
}

function setGridColor(x,y,r,g,b)
{
	colors[x][y].r = r;
	colors[x][y].g = g;
	colors[x][y].b = b;
	var colorChangedEvent = document.createEvent("Event");
	colorChangedEvent.initEvent("gridColorChanged", false, false);
	colorChangedEvent.x = x;
	colorChangedEvent.y = y;
	colorChangedEvent.color = colors[x][y];
	document.dispatchEvent(colorChangedEvent);
	
}

function setGridIntensity(x,y,intensity)
{
	colors[x][y].intensity = intensity;
	var colorChangedEvent = document.createEvent("Event");
	colorChangedEvent.initEvent("gridColorChanged", false, false);
	colorChangedEvent.x = x;
	colorChangedEvent.y = y;
	colorChangedEvent.color = colors[x][y];
	document.dispatchEvent(colorChangedEvent);
}

function setGridColorAndIntensity(x,y,r,g,b,intensity)
{
	colors[x][y].r = r;
	colors[x][y].g = g;
	colors[x][y].b = b;
	colors[x][y].intensity = intensity;
	var colorChangedEvent = document.createEvent("Event");
	colorChangedEvent.initEvent("gridColorChanged", false, false);
	colorChangedEvent.x = x;
	colorChangedEvent.y = y;
	colorChangedEvent.color = colors[x][y];
	document.dispatchEvent(colorChangedEvent);
}

function flashGridButton(x, y)
{
	colors[x][y].flash = 1;
	colorChangedEvent.initEvent("colorChanged", x, y, colors[x][y]);
	document.dispatchEvent(colorChanged);
}

////////////////////// MUSIC DATA ////////////////////

var MAJOR_SCALE = [0,2,4,5,7,9,11];
var MINOR_SCALE = [0,2,3,5,7,8,10];
var BLUES_SCALE = [0,2,3,5,6,9,10];

var FREQUENCIES = []; // an array of MIDI frequencies based on A4 = 440hz
for(var i = 0; i < 127; ++i)
{
	a = Math.pow(2,1.0/12.0);
	FREQUENCIES[i] = 440 * Math.pow(a, i - 81);
}

var PATTERN_COLORS = [
	[1.0,0.5,0.5],
	[1.0,1.0,0.5],
	[0.5,1.0,0.5],
	[0.5,1.0,1.0],
	[0.5,0.5,1.0],
	[1.0,0.5,1.0],
	[1.0,1.0,1.0],
	[1.0,0.0,0.0],
	[1.0,1.0,0.0],
	[0.0,1.0,0.0],
	[0.0,1.0,1.0],
	[0.0,0.0,1.0],
	[1.0,0.0,1.0],
	[0.5,0.0,0.0],
	[0.5,0.5,0.0],
	[0.0,0.5,0.0],
	[0.0,0.5,0.5],
	[0.0,0.0,0.5],
	[0.5,0.0,0.5],
	[0.5,0.5,0.5],
];
var MAX_PATTERNS = 16;
var chordProgression = [0, 4, 5, 3, -1, -1, -1, -1];
var baseNote = 60; // MIDI C4
var bpm = 120;
var scale = MAJOR_SCALE;
var currentTick = 0;
var currentTab = 0;

class Channel
{
	constructor()
	{
		this.mode = "Harmony";
		this.patterns = [];
		this.patternChain = [];
		for(var i = 0; i < MAX_PATTERNS; ++i)
		{
			this.patterns[i] = [];
			for(var j = 0; j < GRID_WIDTH; ++j)
			{
				this.patterns[i][j] = [];
				for(var k = 0; k < GRID_HEIGHT; ++k)
				{
					this.patterns[i][j][k] = false;
				}
			}
		}
		for(var i = 0; i < GRID_WIDTH; ++i)
		{
			this.patternChain[i] = -1;
		}
	}
	
	getPattern(tab)
	{
		if(tab < 0 || tab >= WIDTH)
			return null;
		if(patternChain[tab] == -1)
			return null;
		return patterns[patternChain]
	}
	
	
	getFrequencies(tab, tick)
	{
		if(tab  < 0 || tab >= WIDTH)
			return [];
		if(tick < 0 || tick >= WIDTH)
			return [];
		if(this.patternChain[tab] == -1)
			return [];
		
		var patternSlice = patterns[patternChain][tick];
		var generateFrequency;
		var chord = chordProgression[tab%chordProgression.length];
		if(this.mode == "Harmony")
		{
			generateFrequency = function(id)
			{
				var scaleId = id + chord;
				var note = baseNote + scale[scaleId%7]+(Math.floor(scaleId/7)*12);
				return FREQUENCIES[note];
			};
		}
		else if(this.mode == "Melody")
		{
			generateFrequency = function(id)
			{
				var scaleId = id;
				var note = baseNote + scale[scaleId%7]+(Math.floor(scaleId/7)*12);
				return FREQUENCIES[note];
			};
		}
		else if(this.mode == "Chromatic")
		{
			generateFrequency = function(id)
			{
				var scaleId = id;
				var note = baseNote + note;
				return FREQUENCIES[note];
			};
		}
		var returnList = [];
		for(var i = 0; i < GRID_HEIGHT; ++i)
		{
			if(patternSlice[i])
			{
				returnList.push(generateFrequency(i));
			}
		}
		return returnList;
	}
}

var channels = [];
for(var i = 0; i < GRID_HEIGHT; ++i)
{
	channels[i] = new Channel();
}

