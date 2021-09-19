import { intersection } from "./littleLib.js";
export class Rect {
    constructor() {
        this.name = "obj";
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.movingX = 0;
        this.movingY = 0;
    }
    draw(ctx, cellSize, moving) {
        ctx.save();
        ctx.fillStyle = "lightblue";
        ctx.strokeStyle = "lightgreen";
        ctx.lineWidth = 2;
        if (moving)
            ctx.translate(this.movingX, this.movingY);
        else
            ctx.translate(this.x * cellSize, this.y * cellSize);
        ctx.fillRect(0, 0, this.width * cellSize, this.height * cellSize);
        ctx.strokeRect(0, 0, this.width * cellSize, this.height * cellSize);
        ctx.fillStyle = "blue";
        const minSize = Math.min(this.height, this.width) * cellSize;
        ctx.font = `${minSize / this.name.length * 1.8}px Arial`;
        ctx.fillText(this.name, 0, this.height * cellSize / 2);
        ctx.restore();
    }
    intersection(x, y, cellSize) {
        return intersection.rectPoint({
            x: this.x * cellSize,
            y: this.y * cellSize,
            width: this.width * cellSize,
            height: this.height * cellSize
        }, { x, y });
    }
}
