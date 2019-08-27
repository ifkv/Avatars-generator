var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function placeAvatar() {
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
function placeIfApplicable(node) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (node.type) {
            case 'RECTANGLE':
            case 'ELLIPSE':
            case 'POLYGON':
            case 'STAR':
            case 'VECTOR':
            case 'TEXT': {
                const newFills = [];
                newFills.push(yield placeAvatar());
                node.fills = newFills;
                break;
            }
            default: {
                let err = "Can't be applied to a " + node.type + '. Please select the available shape and run the plugin again';
                return figma.closePlugin(err);
            }
        }
    });
}
if (figma.currentPage.selection.length > 1) {
    figma.closePlugin('You can only choose one shape');
}
else if (figma.currentPage.selection.length == 0) {
    figma.closePlugin('You need to select one shape');
}
else {
    Promise.all(figma.currentPage.selection.map(selected => placeIfApplicable(selected)))
        .then(() => figma.closePlugin());
}
