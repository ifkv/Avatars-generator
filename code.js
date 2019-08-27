var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function invertPaint() {
    return __awaiter(this, void 0, void 0, function* () {
        figma.showUI(__html__, { visible: false });
        figma.ui.postMessage('people');
        const newBytes = yield new Promise((resolve, reject) => {
            figma.ui.onmessage = value => resolve(value);
        });
        let imageHash = figma.createImage(newBytes).hash;
        return { type: "IMAGE", scaleMode: "FILL", imageHash };
    });
}
function invertIfApplicable(node) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (node.type) {
            case 'RECTANGLE':
            case 'ELLIPSE':
            case 'POLYGON':
            case 'STAR':
            case 'VECTOR':
            case 'TEXT': {
                const newFills = [];
                newFills.push(yield invertPaint());
                node.fills = newFills;
                break;
            }
            default: {
                console.log('Wrong type:', node.type);
            }
        }
    });
}
Promise.all(figma.currentPage.selection.map(selected => invertIfApplicable(selected)))
    .then(() => figma.closePlugin());
