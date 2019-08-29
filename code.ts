async function placeAvatar() {
  figma.showUI(__html__, { visible: false })
  figma.ui.postMessage('')
  const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    figma.ui.onmessage = value => resolve(value as Uint8Array)
  })
  let imageHash = figma.createImage(newBytes).hash
  return { type: "IMAGE", scaleMode: "FILL", imageHash }
}

async function placeIfApplicable(node) {
  switch (node.type) {
    case 'RECTANGLE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'TEXT': {
      const newFills = []
      newFills.push(await placeAvatar())
      node.fills = newFills
      break
    }
    default: {
      let err = "Can't be applied to a " + node.type + '. Please select the available shape and run the plugin again'
      return figma.closePlugin(err)
    }
  }
}

(async () => {
  if (figma.currentPage.selection.length) {
      for (const node of figma.currentPage.selection) {
        await placeIfApplicable(node);
      }
      figma.closePlugin();
  	}
    else if (figma.currentPage.selection.length == 0)
    {
      figma.closePlugin('You need to select at least one shape');
    }
})()
