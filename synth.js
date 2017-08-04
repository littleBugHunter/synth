
var grid = {};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 

function onTick()
{
	++currentTick;
	if(currentTick >= GRID_WIDTH)
	{
		currentTick = 0;
		++currentTab;
		++currentChord;
		
		if(currentTab >= GRID_WIDTH)
		{
			currentTab = 0;
			currentChord = 0;
		}
		else
		{
			var isThereMoreSong = false;
			for(var i = currentTab; i < GRID_WIDTH && !isThereMoreSong; ++i)
			{
				for(var j = 0; j < channels.length && !isThereMoreSong; ++j)
				{
					if(channels[j].patternChain[i] != -1)
					{
						isThereMoreSong = true;
					}
				}
			}
			if(!isThereMoreSong)
			{
				currentTab = 0;
				currentChord = 0;
			}
		}
		if(chordProgression[currentChord] == -1)
		{
			currentChord = 0;
		}
		
		tabEvent = document.createEvent("Event");
		tabEvent.initEvent("tab", false, false);
		document.dispatchEvent(tabEvent);
	}
	
    var now = audioCtx.currentTime;
	for(var i = 0; i < channels.length; ++i)
	{
		var frequencies = channels[i].getFrequencies(currentTab, currentTick);
		for(var j = 0; j < frequencies.length; ++j)
		{
			var gain = audioCtx.createGain();
			gain.connect(audioCtx.destination);
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.333, now + 0.1);
			gain.gain.linearRampToValueAtTime(0.0, now + 0.5);
			var oscillator = audioCtx.createOscillator();
			oscillator.type = "square";
			oscillator.frequency.value = frequencies[j];
			oscillator.start();
			oscillator.stop(now + 0.5);
			oscillator.connect(gain);
			var oscillator2 = audioCtx.createOscillator();
			oscillator2.type = "square";
			oscillator2.frequency.value = frequencies[j]+2;
			oscillator2.start();
			oscillator2.stop(now + 0.5);
			oscillator2.connect(gain);
			var oscillator3 = audioCtx.createOscillator();
			oscillator3.type = "square";
			oscillator3.frequency.value = frequencies[j]-2;
			oscillator3.start();
			oscillator3.stop(now + 0.5);
			oscillator3.connect(gain);
		}
	}
	tickEvent = document.createEvent("Event");
	tickEvent.initEvent("tick", false, false);
	document.dispatchEvent(tickEvent);
}

function play()
{
	stop();
	tickInterval = setInterval(onTick, (60/(bpm*2))*1000);
}

function pause()
{
	clearInterval(tickInterval);
}

function stop()
{
	clearInterval(tickInterval);
	currentTick = -1;
	currentTab = 0;
	currentChord = 0;
}