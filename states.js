
class BaseState
{
	onSwitchTo()
	{
		this.delPressed = false;
		this.fnPressed  = false;
		idButtons["+"].style.backgroundColor     = "#333333";
		idButtons["-"].style.backgroundColor     = "#333333";
		idButtons["play"].style.backgroundColor  = "#003300";
		idButtons["pause"].style.backgroundColor = "#333300";
		idButtons["stop"].style.backgroundColor  = "#330000";
		idButtons["copy"].style.backgroundColor  = "#333333";
		idButtons["del"].style.backgroundColor   = "#330000";
		idButtons["fn"].style.backgroundColor    = "#330033";
	}
	onGridButtonPressed(x,y)
	{}
	onIdButtonPressed(id)
	{
		if(id == "key")
		{
			switchToState(new ScaleSelectState());
		}
		if(id == "chord")
		{
			switchToState(new ChordProgressionState());
		}
		if(id == "pat")
		{
			switchToState(new PatternChainState());
		}
		if(id == "del" || id == "fn")
		{
			if(id == "del")
			{
				this.delPressed = !this.delPressed;
				this.fnPressed = false;
			}
			if(id == "fn")
			{
				this.fnPressed = !this.fnPressed;
				this.delPressed = false;
			}
			if(this.delPressed)
			{
				idButtons["del"].style.backgroundColor = "#FF0000";
			}
			else
			{
				idButtons["del"].style.backgroundColor = "#330000";
			}
			if(this.fnPressed)
			{
				idButtons["fn"].style.backgroundColor = "#FF00FF";
			}
			else
			{
				idButtons["fn"].style.backgroundColor = "#330033";
			}
		}
	}
}

class ScaleSelectState extends BaseState
{
	setCurrentScaleIntensity(intensity)
	{
		if(scale == MAJOR_SCALE)
		{
			setGridIntensity(Math.floor((baseNote-60)%6), Math.floor((baseNote-60)/6), intensity);
		}
		if(scale == MINOR_SCALE)
		{
			setGridIntensity(Math.floor((baseNote-60)%6), Math.floor((baseNote-60)/6) + 2, intensity);
		}
		if(scale == BLUES_SCALE)
		{
			setGridIntensity(Math.floor((baseNote-60)%6), Math.floor((baseNote-60)/6) + 4, intensity);
		}
	}
	
	onSwitchTo()
	{
		this.__proto__.__proto__.onSwitchTo();
		var r, g, b;
		for(var x = 0; x < GRID_WIDTH; ++x)
			for(var y = 0; y < GRID_HEIGHT; ++y)
			{
				if(x < 6 && y < 2) // MAJOR SCALES
				{
					r = 1;
					g = 1;
					b = 0;
				}
				else if(x < 6 && y < 4) // MINOR SCALES
				{
					r = 1;
					g = 0;
					b = 0;
				}
				else if(x < 6 && y < 6) // BLUES SCALES
				{
					r = 0;
					g = 0;
					b = 1;
				}
				else
				{
					r = 0;
					g = 0;
					b = 0;
				}
				setGridColorAndIntensity(x, y, r, g, b, 0.2);
			}
		this.setCurrentScaleIntensity(1);
	}
	
	onGridButtonPressed(x,y)
	{
		var note = x + ((y%2)*6);
		this.setCurrentScaleIntensity(0.2); // darken old scale
		if(x < 6 && y < 2) // MAJOR SCALES
		{
			baseNote = note + 60;
			scale = MAJOR_SCALE;
		}
		else if(x < 6 && y < 4) // MINOR SCALES
		{
			baseNote = note + 60;
			scale = MINOR_SCALE;
		}
		else if(x < 6 && y < 6) // BLUES SCALES
		{
			baseNote = note + 60;
			scale = BLUES_SCALE;
		}
		this.setCurrentScaleIntensity(1); // highlight new scale
	}
}


class ChordProgressionState extends BaseState
{
	onSwitchTo()
	{
		this.__proto__.__proto__.onSwitchTo();
		for(var x = 0; x < GRID_WIDTH; ++x)
			for(var y = 0; y < GRID_HEIGHT; ++y)
			{
				setGridColorAndIntensity(x, y, 1, 0, 0, 0.2);
			}
		for(var i = 0; i < GRID_WIDTH; ++i)
		{
			if(chordProgression[i] != -1)
			{
				setGridIntensity(i, 7-chordProgression[i], 1);
			}
		}
		
	}
	onGridButtonPressed(x,y)
	{
		
		if(chordProgression[x] != -1)
		{
			setGridIntensity(x, 7-chordProgression[x], 0.2);
		}
		if(this.delPressed)
		{
			chordProgression[x] = -1;
		}
		else
		{
			chordProgression[x] = 7-y;
			setGridIntensity(x, 7-chordProgression[x], 1);
		}
	}
}


class PatternChainState extends BaseState
{
	onSwitchTo()
	{
		this.__proto__.__proto__.onSwitchTo();
		this.selectedPattern = 0;
		for(var x = 0; x < GRID_WIDTH; ++x)
			for(var y = 0; y < GRID_HEIGHT; ++y)
			{
				var chainId = channels[y].patternChain[x];
				if(chainId == -1)
				{
					setGridColorAndIntensity(x, y, 0.2, 0.2, 0.2, 1);
				}
				else
				{
					var color = PATTERN_COLORS[chainId];
					setGridColorAndIntensity(x, y, color[0], color[1], color[2], 1);
				}
			}
		var color = new ButtonColor(PATTERN_COLORS[this.selectedPattern][0], PATTERN_COLORS[this.selectedPattern][1], PATTERN_COLORS[this.selectedPattern][2]).getHexColor();
		idButtons["+"].style.backgroundColor = color;
		idButtons["-"].style.backgroundColor = color;
	}
	onGridButtonPressed(x,y)
	{
		if(this.fnPressed)
		{
			var patternId = channels[y].patternChain[x];
			if(patternId != -1)
			{
				switchToState(new PatternEditState(y, patternId));
			}
		}
		else if(!this.delPressed)
		{
			channels[y].patternChain[x] = this.selectedPattern;
			var color = PATTERN_COLORS[this.selectedPattern];
			setGridColorAndIntensity(x, y, color[0], color[1], color[2], 1);
		}
		else
		{
			channels[y].patternChain[x] = -1;
			setGridColorAndIntensity(x, y, 0.2, 0.2, 0.2, 1);
		}
	}
	
	onIdButtonPressed(id)
	{
		this.__proto__.__proto__.onIdButtonPressed(id);
		if(id == "-")
		{
			--this.selectedPattern;
			if(this.selectedPattern < 0)
			{
				this.selectedPattern = MAX_PATTERNS;
			}
			var color = new ButtonColor(PATTERN_COLORS[this.selectedPattern][0], PATTERN_COLORS[this.selectedPattern][1], PATTERN_COLORS[this.selectedPattern][2]).getHexColor();
			idButtons["+"].style.backgroundColor = color;
			idButtons["-"].style.backgroundColor = color;
		}
		if(id == "+")
		{
			++this.selectedPattern;
			if(this.selectedPattern >= MAX_PATTERNS)
			{
				this.selectedPattern = 0;
			}
			var color = new ButtonColor(PATTERN_COLORS[this.selectedPattern][0], PATTERN_COLORS[this.selectedPattern][1], PATTERN_COLORS[this.selectedPattern][2]).getHexColor();
			idButtons["+"].style.backgroundColor = color;
			idButtons["-"].style.backgroundColor = color;
		}
	}
}

class PatternEditState extends BaseState
{
	
	constructor(channelId, patternId)
	{
		super();
		this.channelId = channelId;
		this.patternId = patternId;
		this.color     = PATTERN_COLORS[patternId];
	}
	
	onSwitchTo()
	{
		this.__proto__.__proto__.onSwitchTo();
		var pattern = channels[this.channelId].patterns[this.patternId];
		for(var x = 0; x < GRID_WIDTH; ++x)
			for(var y = 0; y < GRID_HEIGHT; ++y)
			{
				setGridColorAndIntensity(x, y, this.color[0], this.color[1], this.color[2], 0.2);
				if(pattern[x][y])
				{
					setGridIntensity(x,y,1);
				}
			}
		var color = new ButtonColor(PATTERN_COLORS[this.patternId][0], PATTERN_COLORS[this.patternId][1], PATTERN_COLORS[this.patternId][2]).getHexColor();
		idButtons["+"].style.backgroundColor = color;
		idButtons["-"].style.backgroundColor = color;
	}
	
	
	onGridButtonPressed(x,y)
	{
		if(!this.delPressed)
		{
			channels[this.channelId].patterns[this.patternId][x][y] = !channels[this.channelId].patterns[this.patternId][x][y];
			setGridIntensity(x, y, channels[this.channelId].patterns[this.patternId][x][y] ? 1 : 0.2);
		}
		else
		{
			channels[this.channelId].patterns[this.patternId][x][y] = false;
			setGridIntensity(x, y, 0.2);
		}
	}
	onIdButtonPressed(id)
	{
		this.__proto__.__proto__.onIdButtonPressed(id);
		if(id == "-")
		{
			var newPattern = this.patternId - 1;
			if(newPattern < 0)
			{
				newPattern = MAX_PATTERNS - 1;
			}
			switchToState(new PatternEditState(this.channelId, newPattern));
		}
		if(id == "+")
		{
			var newPattern = this.patternId + 1;
			if(newPattern >= MAX_PATTERNS)
			{
				newPattern = 0;
			}
			switchToState(new PatternEditState(this.channelId, newPattern));
		}
	}
}


var currentState;
function switchToState(state)
{
	currentState = state;
	currentState.onSwitchTo();
}


document.addEventListener("gridButtonPressed", function(e){ currentState.onGridButtonPressed(e.x, e.y); });
document.addEventListener("idButtonPressed",   function(e){ currentState.onIdButtonPressed(e.id); });
switchToState(new ScaleSelectState());


