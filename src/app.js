// ceate a datastructure to store the image data

// sampleData = {
//   id: 1,
//   title: "Image 1",
//   src: "https://picsum.photos/200/300",
//   tags: [{}]
// };

// stored Rects in an array
let rectCount = 0
let rects = []

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
var canvasOffset = canvas.getBoundingClientRect()
var offsetX = canvasOffset.left
var offsetY = canvasOffset.top

// this flage is true when the user is dragging the mouse
var isDown = false

// these vars will hold the starting mouse position
var startX
var startY

const redrawCanvas = () => {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = "#a9a9a9"
  ctx.fillStyle = "#a9a9a9"

  for (var i = 0; i < rects.length; i++) {
    ctx.strokeRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height)
    ctx.fillText(rects[i].caption, rects[i].x + 5, rects[i].y + 13)
  }
}

const handleClearAll = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  rects = []
  rectCount = 0
  document.getElementById("tags").innerHTML = ""
}

const handleMouseDown = (e) => {
  e.preventDefault()
  e.stopPropagation()

  // save the starting x/y of the rectangle
  startX = parseInt(e.clientX - offsetX)
  startY = parseInt(e.clientY - offsetY)

  // set a flag indicating the drag has begun
  isDown = true
}

const handleMouseUp = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDown = false
  rectCount += 1
  caption = `Tag ${rectCount}`

  // only add the rectangle if the width/height are non-zero
  threshold = 5
  width = parseInt(e.clientX - offsetX) - startX
  height = parseInt(e.clientY - offsetY) - startY
  if ((width > threshold || width < -threshold) && (height > threshold || height < -threshold)) {
    var rect = {
      id: rectCount,
      x: startX,
      y: startY,
      width: width,
      height: height,
      caption: caption
    }
    ctx.fillText(caption, startX + 5, startY + 13)
    rects.push(rect)

    // Append to the Tags ol
    const li = document.createElement("li")
    li.innerHTML = caption
    const deleteButton = document.createElement("a")
    deleteButton.innerHTML = "Delete"
    deleteButton.id = rectCount
    deleteButton.onclick = () => {
      deleteButton.parentElement.remove()
      rects = rects.filter((rect) => parseInt(rect.id) !== parseInt(deleteButton.id))
      redrawCanvas()
    }
    li.appendChild(deleteButton)
    document.getElementById("tags").appendChild(li)
  }
}

const handleMouseOut = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDown = false
}

const handleMouseMove = (e) => {
  e.preventDefault()
  e.stopPropagation()

  // if we're not dragging, just return
  if (!isDown) {
    return
  }

  // stroke color
  ctx.strokeStyle = "#2d92ff"

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX)
  mouseY = parseInt(e.clientY - offsetY)

  redrawCanvas()

  // calculate the rectangle width/height based
  // on starting vs current mouse position
  var width = mouseX - startX
  var height = mouseY - startY

  // draw a new rect from the start position
  // to the current mouse position
  ctx.strokeRect(startX, startY, width, height)
  x1 = startX
  y1 = startY
  x2 = width
  y2 = height
}

document.getElementById("canvas").addEventListener("mousedown", function (e) {
  handleMouseDown(e)
})
document.getElementById("canvas").addEventListener("mousemove", function (e) {
  handleMouseMove(e)
})
document.getElementById("canvas").addEventListener("mouseup", function (e) {
  handleMouseUp(e)
})
document.getElementById("canvas").addEventListener("mouseout", function (e) {
  handleMouseOut(e)
})
