(function(j5g3) {
var
	event_text = j5g3.text({ y: 240, x: 200})
;

	mouse.click = function(ev) {
		event_text.text = 'click';	
	};
	
	mouse.fire = function(ev) {
		event_text.text = 'fire';
	};
	
	this.stage.set({
		font: '50px sans-serif',
		fill: '#eee'
	});
	
	this.stage.add([
		event_text
	]);
	this.run();
})