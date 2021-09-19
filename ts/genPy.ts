import { Form } from "./form";
import { Rect } from "./rect";

export function genPy(form: Form, rects: Rect[])
{
	let text = ""
	text += header;
	text += genForm(form);
	rects.forEach(rect => {
		text += genRect(rect, form);
	});
	text += footer;
	return text;
}
function genForm(form: Form)
{
	return `        self.setGeometry(300, 300, ${form.width * form.cellSize + form.margin * 2}, ${form.height * form.cellSize + form.margin * 2})
        self.setWindowTitle("Title")
        fontSize = 15`;
}
function genRect(rect: Rect, form: Form)
{
	return `

        self.${rect.name} = QLabel(self)
        self.${rect.name}.move(${rect.x * form.cellSize + form.margin}, ${rect.y * form.cellSize + form.margin})
        self.${rect.name}.resize(${rect.width * form.cellSize}, ${rect.height * form.cellSize})
        self.${rect.name}.setText("${rect.name}")
        f = self.${rect.name}.font()
        f.setPointSize(fontSize)
        self.${rect.name}.setFont(f)`
}

const header = `import sys

from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtWidgets import QLabel


class Form(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
`;
const footer = `


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Form()
    ex.show()
    sys.exit(app.exec())
`;