async function invertPaint() {
  figma.showUI(__html__, { visible: false })
  figma.ui.postMessage('people')
  const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    figma.ui.onmessage = value => resolve(value as Uint8Array)
  })
  let imageHash = figma.createImage(newBytes).hash
  return { type: "IMAGE", scaleMode: "FILL", imageHash }
}

async function invertIfApplicable(node) {
  switch (node.type) {
    case 'RECTANGLE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'TEXT': {
      const newFills = []
      newFills.push(await invertPaint())  
      node.fills = newFills
      break
    }
    default: {
      console.log('Wrong type:', node.type)
    }
  }
}

Promise.all(figma.currentPage.selection.map(selected => invertIfApplicable(selected)))
       .then(() => figma.closePlugin())
