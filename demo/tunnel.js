/*
 * Based on Fabien Sanglard's post at http://fabiensanglard.net/Tunnel/index.php
 */
(function (j5g3, document, undefined) {

var
	WIDTH = this.stage.width,
	HEIGHT= this.stage.height,

	txtimg = j5g3.id('tunnel'), 

	TEXTUREHEIGHT = txtimg.height,
	TEXTUREWIDTH  = txtimg.width,
	x, y, cursor,

	texture = this.imagedata(txtimg),

	TW4 = TEXTUREWIDTH * 4,

	draw = j5g3.image({
		
		display: this.imagedata(),
		
		shiftX: TEXTUREWIDTH, 
		shiftY: TEXTUREHEIGHT,
		
		update: function()
		{
		var
			c, 
			data=this.display.data, 
			tdata=texture.data, 
			cursor=data.length,
			sx = this.shiftX++,
			sy = this.shiftY++
		;
			while ((cursor-=4))
			{
				c =	(distances[cursor] + sx) % TEXTUREWIDTH * 4 + 
					(((angles[cursor] + sy) % TEXTUREHEIGHT) * TW4)
				;
	
				data[cursor] = tdata[c];
				data[cursor+1] = tdata[c+1];
				data[cursor+2] = tdata[c+2];
			}
		},
		
		draw: function(context)
		{
			context.putImageData(this.display, 0, 0);
		}
	}),
	
	distances = new Array(draw.display.data.length),
	angles = new Array(distances.length)
;
	for (y=0, cursor=0; y<HEIGHT; y++)
		for (x=0; x<WIDTH; x++, cursor+=4)
		{
			distances[cursor] = (Math.round(30 * TEXTUREHEIGHT / Math.sqrt(
				(x - WIDTH/2) * (x - WIDTH / 2) + (y - HEIGHT / 2) * (y - HEIGHT / 2)
			)) % TEXTUREHEIGHT) || 0;
			
			angles[cursor] = Math.round(TEXTUREWIDTH / 2 * Math.atan2(y - HEIGHT / 2, x - WIDTH / 2) / Math.PI);

			// Initialize alpha to 255!
			draw.display.data[x * 4 + y * WIDTH * 4 + 3] = 255;
		}

	this.stage.add(draw);
	
	this.fps(32).run();
})
