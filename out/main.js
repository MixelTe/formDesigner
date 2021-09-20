import { Form } from "./form.js";
import { genPy } from "./genPy.js";
import * as Lib from "./littleLib.js";
import { Rect } from "./rect.js";
const canvas = Lib.get.canvas("canvas");
const ctx = Lib.canvas.getContext2d(canvas);
const rects = [];
const form = new Form();
let cellSize = 0;
let selectedRect = null;
let offSetX = 0;
let offSetY = 0;
let rectsCreated = 0;
addInputListenerField("inp_margin", "margin");
addInputListenerField("inp_cellSize", "cellSize");
addInputListenerField("inp_formWidth", "width");
addInputListenerField("inp_formHeight", "height");
Lib.addButtonListener("btn_add", addRect);
Lib.addButtonListener("btn_remove", removeRect);
const rectInputs = {
    name: Lib.get.input("inp_name"),
    x: Lib.get.input("inp_x"),
    y: Lib.get.input("inp_y"),
    width: Lib.get.input("inp_width"),
    height: Lib.get.input("inp_height"),
};
addInputListenerRect("inp_x", "x", 0);
addInputListenerRect("inp_y", "y", 0);
addInputListenerRect("inp_width", "width");
addInputListenerRect("inp_height", "height");
addInputListener("inp_name", inp => {
    if (selectedRect != null) {
        if (inp.value.length > 0)
            selectedRect.name = inp.value;
        inp.value = selectedRect.name;
        drawAll();
    }
});
setRect(null);
window.addEventListener("resize", drawAll);
let rectToMove = null;
let rectMoveDX = 0;
let rectMoveDY = 0;
let rectToSize = null;
let rectSizeChanged = false;
let rectJustCreated = false;
canvas.addEventListener("mousedown", e => {
    const x = e.offsetX - offSetX;
    const y = e.offsetY - offSetY;
    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (rect.intersection(x, y, cellSize)) {
            setRect(rect);
            if (e.button == 2) {
                rectSizeChanged = false;
                rectToSize = rect;
            }
            else {
                rectToMove = rect;
                rectMoveDX = rect.x * cellSize - x;
                rectMoveDY = rect.y * cellSize - y;
                rect.movingX = x + rectMoveDX;
                rect.movingY = y + rectMoveDY;
            }
            return;
        }
    }
    if (e.button == 0) {
        const x = Math.floor((e.offsetX - offSetX) / cellSize);
        const y = Math.floor((e.offsetY - offSetY) / cellSize);
        if (x >= 0 && y >= 0 && x < form.width && y < form.height) {
            const rect = addRect(null, x, y);
            rectJustCreated = true;
            rectSizeChanged = false;
            rectToSize = rect;
        }
    }
});
canvas.addEventListener("contextmenu", e => e.preventDefault());
canvas.addEventListener("mousemove", e => {
    if (rectToMove != null) {
        const x = e.offsetX - offSetX;
        const y = e.offsetY - offSetY;
        rectToMove.movingX = x + rectMoveDX;
        rectToMove.movingY = y + rectMoveDY;
        drawAll();
    }
    else if (rectToSize != null) {
        const x = e.offsetX - offSetX;
        const y = e.offsetY - offSetY;
        const width = Math.floor(x / cellSize) + 1 - rectToSize.x;
        const height = Math.floor(y / cellSize) + 1 - rectToSize.y;
        const w = Math.min(form.width - rectToSize.x, Math.max(1, width));
        const h = Math.min(form.height - rectToSize.y, Math.max(1, height));
        if (rectToSize.width != w || rectToSize.height != h)
            rectSizeChanged = true;
        rectToSize.width = w;
        rectToSize.height = h;
        drawAll();
    }
});
canvas.addEventListener("mouseup", e => {
    if (rectToMove != null) {
        rectToMove.x = Math.floor((rectToMove.movingX + cellSize / 2) / cellSize);
        rectToMove.y = Math.floor((rectToMove.movingY + cellSize / 2) / cellSize);
        rectToMove.x = Math.min(Math.max(rectToMove.x, 0), form.width - 1);
        rectToMove.y = Math.min(Math.max(rectToMove.y, 0), form.height - 1);
        rectToMove = null;
        drawAll();
    }
    else if (rectToSize != null) {
        rectToSize = null;
        drawAll();
        if (rectJustCreated) {
            rectJustCreated = false;
            return;
        }
        if (rectSizeChanged)
            return;
        const x = e.offsetX - offSetX;
        const y = e.offsetY - offSetY;
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (rect.intersection(x, y, cellSize)) {
                selectedRect = rect;
                removeRect();
                return;
            }
        }
    }
});
Lib.addButtonListener("btn_copy", () => {
    const str = genPy(form, rects);
    Lib.copyText(str);
});
Lib.addButtonListener("btn_download", () => {
    const str = genPy(form, rects);
    Lib.downloadFile("form.py", str);
});
drawAll();
function drawAll() {
    canvas.style.width = "0px";
    canvas.style.height = "0px";
    Lib.canvas.fitToParent.ClientWH(canvas);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSizes();
    form.draw(ctx, cellSize, true);
    rects.forEach(rect => rect.draw(ctx, cellSize, rect == rectToMove));
    ctx.restore();
}
function setSizes() {
    const sw = canvas.width / form.width;
    const sh = canvas.height / form.height;
    cellSize = Math.min(sw, sh);
    const width = form.width * cellSize;
    const height = form.height * cellSize;
    offSetX = (canvas.width - width) / 2;
    offSetY = (canvas.height - height) / 2;
    ctx.translate(offSetX, offSetY);
}
function setRect(rect) {
    selectedRect = rect;
    if (rect == null) {
        rectInputs.name.disabled = true;
        rectInputs.x.disabled = true;
        rectInputs.y.disabled = true;
        rectInputs.width.disabled = true;
        rectInputs.height.disabled = true;
    }
    else {
        rectInputs.name.disabled = false;
        rectInputs.x.disabled = false;
        rectInputs.y.disabled = false;
        rectInputs.width.disabled = false;
        rectInputs.height.disabled = false;
        rectInputs.name.value = rect.name;
        rectInputs.x.valueAsNumber = rect.x;
        rectInputs.y.valueAsNumber = rect.y;
        rectInputs.width.valueAsNumber = rect.width;
        rectInputs.height.valueAsNumber = rect.height;
    }
}
function addInputListener(id, f, onCreate) {
    const inp = document.getElementById(id);
    if (inp == undefined)
        throw new Error(`El not found: ${id}`);
    if (!(inp instanceof HTMLInputElement))
        throw new Error(`El not input: ${id}`);
    inp.addEventListener("change", f.bind(undefined, inp));
    if (onCreate)
        onCreate(inp);
}
function addInputListenerField(id, field) {
    addInputListener(id, inp => {
        const v = Math.max(1, inp.valueAsNumber);
        form[field] = v;
        inp.valueAsNumber = v;
        drawAll();
    }, inp => inp.valueAsNumber = form[field]);
}
function addInputListenerRect(id, field, min = 1) {
    addInputListener(id, inp => {
        if (selectedRect == null)
            return;
        let v = Math.max(min, inp.valueAsNumber);
        if (field == "x") {
            v = Math.min(v, form.width - 1);
            selectedRect.width = Math.min(selectedRect.width, form.width - v);
        }
        else if (field == "y") {
            v = Math.min(v, form.height - 1);
            selectedRect.height = Math.min(selectedRect.height, form.height - v);
        }
        else if (field == "width")
            v = Math.min(v, form.width - selectedRect.x);
        else if (field == "height")
            v = Math.min(v, form.height - selectedRect.y);
        selectedRect[field] = v;
        inp.valueAsNumber = v;
        drawAll();
    });
}
function addRect(e, x, y) {
    const rect = new Rect();
    rects.push(rect);
    if (x)
        rect.x = x;
    if (y)
        rect.y = y;
    rectsCreated += 1;
    rect.name += rectsCreated;
    setRect(rect);
    drawAll();
    return rect;
}
function removeRect() {
    if (selectedRect == null)
        return;
    const i = rects.indexOf(selectedRect);
    if (i >= 0)
        rects.splice(i, 1);
    setRect(null);
    if (rects.length == 0)
        rectsCreated = 0;
    drawAll();
}
