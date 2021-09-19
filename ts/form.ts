export class Form
{
	public width = 18;
	public height = 8;
	public margin = 16;
	public cellSize = 32;

	public draw(ctx: CanvasRenderingContext2D, cellSize: number, bounds = false)
	{
		ctx.save();
		ctx.fillStyle = "lightgray";
		ctx.fillRect(0, 0, this.width * cellSize, this.height * cellSize);

		if (bounds)
		{
			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
			for (let y = 0; y < this.height - 1; y++)
			{
				for (let x = 0; x < this.width - 1; x++)
				{
					const X = cellSize + cellSize * x;
					const Y = cellSize + cellSize * y;
					drawCross(ctx, cellSize / 10, X, Y)
				}
			}
		}
		ctx.restore();
	}
}

function drawCross(ctx: CanvasRenderingContext2D, size: number, x: number, y: number)
{
	ctx.beginPath();
	ctx.moveTo(x - size / 2, y);
	ctx.lineTo(x + size / 2, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y - size / 2);
	ctx.lineTo(x, y + size / 2);
	ctx.stroke();
}