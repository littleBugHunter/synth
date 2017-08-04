
class BaseState
{
	onSwitchTo()
	{}
	onGridButtonPressed(x,y)
	{}
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

var currentState;
function switchToState(state)
{
	currentState = state;
	currentState.onSwitchTo();
}

document.addEventListener("gridButtonPressed", function(e){ currentState.onGridButtonPressed(e.x, e.y); });
switchToState(new ScaleSelectState());


