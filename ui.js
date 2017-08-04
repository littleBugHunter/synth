
var buttons = {};


function buildGrid(table)
{
	for(var i = 0; i < GRID_WIDTH; ++i)
	{
		buttons[i] = {};
	}
	
	for(var j = 0; j < GRID_HEIGHT; ++j)
	{
		var tr = document.createElement('tr');
		table.appendChild(tr);
		for(var i = 0; i < GRID_WIDTH; ++i)
		{
			var th = document.createElement('th');
			tr.appendChild(th);
			var button = document.createElement('button');
			button.id = "grid_" + i + "_" + j;
			button.className = "grid_button";
			button.addEventListener("click", function(x,y){ return function(){
				var gridButtonPressedEvent = document.createEvent("Event");
				gridButtonPressedEvent.initEvent("gridButtonPressed", false, false);
				gridButtonPressedEvent.x = x;
				gridButtonPressedEvent.y = y;
				document.dispatchEvent(gridButtonPressedEvent);
			}; }(i,j));
			buttons[i][j] = button;
			th.appendChild(button);
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
