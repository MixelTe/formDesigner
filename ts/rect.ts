import { intersection } from "./littleLib.js";

export class Rect
{
	public name = "obj";
	public x = 0;
	public y = 0;
	public width = 1;
	public height = 1;

	public movingX = 0;
	public movingY = 0;

	public draw(ctx: CanvasRenderingContext2D, cellSize: number, moving: boolean)
	{
		ctx.save();
		ctx.fillStyle = "lightblue";
		ctx.strokeStyle = "lightgreen";
		ctx.lineWidth = 2;
		if (moving) ctx.translate(this.movingX, this.movingY);
		else ctx.translate(this.x * cellSize, this.y * cellSize);

		ctx.fillRect(0, 0, this.width * cellSize, this.height * cellSize);
		ctx.strokeRect(0, 0, this.width * cellSize, this.height * cellSize);

		ctx.fillStyle = "blue";
		const minSize = Math.min(this.height, this.width) * cellSize;
		ctx.font = `${minSize / this.name.length * 1.8}px Arial`;
		ctx.fillText(this.name, 0, this.height * cellSize / 2);
		ctx.restore();
	}
	public intersection(x: number, y: number, cellSize: number)
	{
		return intersection.rectPoint({
			x: this.x * cellSize,
			y: this.y * cellSize,
			width: this.width * cellSize,
			height: this.height * cellSize
		}, { x, y });
	}
}