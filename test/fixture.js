
(function() {

window.document.body.innerHTML +=
	'<canvas width="800" height="600" id="screen"></canvas>' +
	'<img id="img" src="base/test/earth.gif" />' +
	'<img id="soccer" src="base/test/ball.gif" />';

window.basePath = 'base/test/';

if (!window.Audio)
{
	//var x = j5g3.dom('audio');

	window.HTMLAudioElement = window.Audio = function() {};
}

if (!window.CustomEvent)
{
	window.CustomEvent = function(event, params) {
	  var evt;
	  params = params || {
	    bubbles: false,
	    cancelable: false,
	    detail: undefined
	  };
	  evt = document.createEvent("CustomEvent");
	  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	  return evt;
	};

	window.CustomEvent.prototype = window.Event.prototype;
}


})();