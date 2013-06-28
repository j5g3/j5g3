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

	ArrayType = window.Int8Array || Array,

	distances = new ArrayType(draw.display.data.length),
	angles = new ArrayType(distances.length)
;
	for (y=0, cursor=0; y<HEIGHT; y++)
		for (x=0; x<WIDTH; x++, cursor+=4)
		{
			distances[cursor] = (30 * TEXTUREHEIGHT / Math.sqrt(
				(x - WIDTH/2) * (x - WIDTH / 2) + (y - HEIGHT / 2) * (y - HEIGHT / 2)
			) | 0) % TEXTUREHEIGHT;

			angles[cursor] = (TEXTUREWIDTH / 2 * Math.atan2(y - HEIGHT / 2, x - WIDTH / 2) / Math.PI) | 0;

			// Initialize alpha to 255!
			draw.display.data[x * 4 + y * WIDTH * 4 + 3] = 255;
		}

	this.stage.add(draw);

	this.run();
})
