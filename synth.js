
var grid = {};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 

function onTick()
{
	++currentTick;
	if(currentTick >= WIDTH)
	{
		currentTick = 0;
		++currentTab;
		if(currentTab >= 4)
		{
			currentTab = 0;
		}
	}
	
    var now = audioCtx.currentTime;
	for(var i = 0; i < channels.length; ++i)
	{
		var frequencies = channels[i].getFrequencies();
		for(var j = 0; j < HEIGHT; ++j)
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
}

init();
var ticks = setInterval(onTick, (60/(BPM*2))*1000);