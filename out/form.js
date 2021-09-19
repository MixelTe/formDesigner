export class Form {
    constructor() {
        this.width = 18;
        this.height = 8;
        this.margin = 16;
        this.cellSize = 32;
    }
    draw(ctx, cellSize, bounds = false) {
        ctx.save();
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, this.width * cellSize, this.height * cellSize);
        if (bounds) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            for (let y = 0; y < this.height - 1; y++) {
                for (let x = 0; x < this.width - 1; x++) {
                    const X = cellSize + cellSize * x;
                    const Y = cellSize + cellSize * y;
                    drawCross(ctx, cellSize / 10, X, Y);
                }
            }
        }
        ctx.restore();
    }
}
function drawCross(ctx, size, x, y) {
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y);
    ctx.lineTo(x + size / 2, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x, y + size / 2);
    ctx.stroke();
}
