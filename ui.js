
var buttons = {};
var idButtons = {};


function buildGrid(table)
{
	for(var i = 0; i < GRID_WIDTH; ++i)
	{
		buttons[i] = {};
	}
	
	var button = null;
	
	var topLabels   = ["-", "+", "play", "pause", "stop", "copy", "del", "fn"];
	var leftLabels  = ["key", "chord", "pat", "", "", "", "", ""];
	var rightLabels = ["", "", "", "", "", "", "", ""];
	
	var label;
	
	var gridDispatcher = function(x,y){ return function(){
		var gridButtonPressedEvent = document.createEvent("Event");
		gridButtonPressedEvent.initEvent("gridButtonPressed", false, false);
		gridButtonPressedEvent.x = x;
		gridButtonPressedEvent.y = y;
		document.dispatchEvent(gridButtonPressedEvent);
	}; };
	
	var idDispatcher = function(id){ return function(){
		var idButtonPressedEvent = document.createEvent("Event");
		idButtonPressedEvent.initEvent("idButtonPressed", false, false);
		idButtonPressedEvent.id = id;
		document.dispatchEvent(idButtonPressedEvent);
	}
	}
	
	var createButton = function()
	{
		button = document.createElement('button');
		button.className = "grid_button";
		th.appendChild(button);
	};
			
	for(var j = 0; j < GRID_HEIGHT + 4; ++j)
	{
		var tr = document.createElement('tr');
		table.appendChild(tr);
		for(var i = 0; i < GRID_WIDTH + 4; ++i)
		{
			var th = document.createElement('th');
			tr.appendChild(th);
			
			if(i >= 2 && i < GRID_WIDTH + 2 && j >= 2 && j < GRID_HEIGHT + 2)
			{
				createButton();
				button.id = "grid_" + i-2 + "_" + j-2;
				button.addEventListener("click", gridDispatcher(i-2,j-2));
				buttons[i-2][j-2] = button;
			}
			else
			{
				label = "";
				if(j == 0 && i >= 2 && i < GRID_WIDTH + 2)
				{
					label = topLabels[i-2];
				}
				
				if(i == 0 && j >= 2 && j < GRID_HEIGHT + 2)
				{
					label = leftLabels[j-2];
				}
				
				if(i == GRID_WIDTH+3 && j >= 2 && j < GRID_HEIGHT + 2)
				{
				}
				if(label != "")
				{
					createButton();
					button.innerText = label;
					button.addEventListener("click", idDispatcher(label));
					idButtons[label] = button;
				}
			}
		}
	}
}



function onGridColorChanged(e)
{
	var color = e.color.getHexColor();
	buttons[e.x][e.y].style.backgroundColor = color;
}

var table = document.getElementById("buttons");
buildGrid(table);
document.addEventListener("gridColorChanged", onGridColorChanged);
