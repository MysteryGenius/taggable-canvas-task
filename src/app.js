// ceate a datastructure to store the image data

let imageCount = 0
let imageData = []

let currImage = {}

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

// calculate where the canvas is on the window
// (used to help calculate mouseX/mouseY)
var canvasOffset = canvas.getBoundingClientRect()
var offsetX = canvasOffset.left
var offsetY = canvasOffset.top

// this flage is true when the user is dragging the mouse
var isDown = false

// var containing information about the current tag being dragged around
var draggedRect = null
var mouseX = 0
var mouseY = 0

// these vars will hold the starting mouse position
var startX
var startY

const getIdFromUrl = () => {
  const url = window.location.href
  const id = url.split("#").pop()
  if (id === url || id === "") {
    return null
  }
  return id
}

const setIdInUrl = (id) => {
  window.location.href = window.location.href.split("#").shift() + "#" + id
}

const saveToLocalStorage = () => {
  localStorage.setItem("imageData", JSON.stringify(imageData))
}

const getFromLocalStorage = () => {
  // if imageData is in localStorage, get it and set it to imageData
  if (localStorage.getItem("imageData")) {
    imageData = JSON.parse(localStorage.getItem("imageData"))
  }
}

const updateCurrImage = () => {
  let currImageIndex = imageData.findIndex((image) => image.id === currImage.id)
  imageData[currImageIndex] = currImage
  saveToLocalStorage()
}

const createNewImage = (image = null) => {
  updateCurrImage()
  imageCount++
  returnable = {
    id: imageCount,
    title: "Image " + imageCount,
    src: image,
    tags: [],
    tagCount: 0
  }
  imageData.push(returnable)
  currImage = returnable
  resetTags()
  refreshSync()
  setIdInUrl(currImage.id)
  return returnable
}

const refreshSync = () => {
  document.getElementById("imageTitle").innerHTML = currImage.title
  document.getElementById("totalImages").innerHTML = imageData.length
  // get index of current image in imageData array
  let currImageIndex = imageData.findIndex((image) => image.id === currImage.id) + 1
  document.getElementById("currImage").innerHTML = currImageIndex
}

const redrawCanvas = (imageDataObj) => {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = "#fff"
  ctx.fillStyle = "#fff"

  tags = imageDataObj.tags

  for (var i = 0; i < imageDataObj.tags.length; i++) {
    ctx.strokeRect(
      imageDataObj.tags[i].x,
      imageDataObj.tags[i].y,
      imageDataObj.tags[i].width,
      imageDataObj.tags[i].height
    )
    ctx.fillText(imageDataObj.tags[i].caption, imageDataObj.tags[i].x + 5, imageDataObj.tags[i].y + 13)
  }
}

const resetTags = () => {
  document.getElementById("tags").innerHTML = ""
}

const clearAllTags = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  resetTags()

  currImage.tags = []
  currImage.tagCount = 0
}

const drawImage = (src) => {
  canvas.style.backgroundImage = `url(${src})`
  canvas.style.backgroundSize = "cover"
  canvas.style.backgroundPosition = "center"
  canvas.style.backgroundRepeat = "no-repeat"
}

const drawTagsList = () => {
  // Append to the Tags ol

  resetTags()

  tags = currImage.tags

  tags.forEach((tag) => {
    const li = document.createElement("li")
    // create a span element to hold the tag name
    const span = document.createElement("span")
    span.id = `tagspan${tag.id}`
    span.innerHTML = tag.caption
    li.appendChild(span)

    // onclick replace the span with an input field and save the tag name in the rect object
    span.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const input = document.createElement("input")
      input.value = span.innerHTML
      span.replaceWith(input)
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          caption = input.value
          span.innerHTML = caption
          currImage.tags.forEach((rect) => {
            if (parseInt(rect.id) === parseInt(span.id.split("tagspan")[1])) {
              rect.caption = caption
            }
          })
          // remove the input field and replace the span with the tag name
          input.replaceWith(span)
          saveToLocalStorage()
          redrawCanvas(currImage)
        }
      })
    })

    const deleteButton = document.createElement("a")
    deleteButton.innerHTML = "Delete"
    deleteButton.id = `delete${tag.id}`
    deleteButton.onclick = () => {
      deleteButton.parentElement.remove()
      currImage.tags = currImage.tags.filter(
        (rect) => parseInt(rect.id) !== parseInt(deleteButton.id.split("delete")[1])
      )
      redrawCanvas(currImage)
    }
    li.appendChild(deleteButton)
    document.getElementById("tags").appendChild(li)
  })
}

const handlePageLoad = () => {
  let id = getIdFromUrl()
  currImage = []
  if (imageData.length <= 0) {
    getFromLocalStorage()
    if (imageData.length <= 0) {
      const image = new Image()
      image.src = "assets/placeholder.jpg"
      image.onload = () => {
        createNewImage(image.src)
        currImage = imageData[0]
      }
    } else {
      console.log("imageData is not empty")
      console.log(imageData)
      console.log(id)
      currImage = imageData[0]
      if (id) {
        currImage = imageData.find((image) => image.id === parseInt(id))
      }
    }
    drawImage(currImage.src)
    drawTagsList()
    redrawCanvas(currImage)
    refreshSync()
  }
}

const handleDeleteButtonClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  // remove the image from the imageData array
  id = getIdFromUrl()
  if (id) {
    imageData = imageData.filter((image) => image.id !== parseInt(id))
    localStorage.removeItem("imageData")
  }
  saveToLocalStorage()
  currImage = imageData[0]
  redrawCanvas(currImage)
  drawImage(currImage.src)
  drawTagsList()
  refreshSync()
}

const handleBackButtonClick = (e) => {
  e.preventDefault()
  // this will replace the current image with the previous image
  // if there is no previous image, do nothing
  if (imageData.length > 1) {
    // find current image in array
    let currImageIndex = imageData.findIndex((image) => image.id === currImage.id)
    // if there is a previous image, set it to currImage
    if (currImageIndex > 0) {
      updateCurrImage()
      currImage = imageData[currImageIndex - 1]
    }
    drawImage(currImage.src)
    drawTagsList()
    redrawCanvas(currImage)
    refreshSync()
    setIdInUrl(currImage.id)
  }
}

const handleNextButtonClick = (e) => {
  e.preventDefault()
  // this will replace the current image with the next image
  // if there is no next image, do nothing
  if (imageData.length > 1) {
    // find current image in array
    let currImageIndex = imageData.findIndex((image) => image.id === currImage.id)
    // if there is a next image, set it to currImage
    upperLimit = imageData.length - 1
    if (currImageIndex < upperLimit) {
      updateCurrImage()
      currImage = imageData[currImageIndex + 1]
    }
    drawImage(currImage.src)
    drawTagsList()
    redrawCanvas(currImage)
    refreshSync()
    setIdInUrl(currImage.id)
  }
}

const handleImageTitleClick = (e) => {
  const imageTitle = e.target
  const imageTitleInput = document.createElement("input")
  imageTitleInput.type = "text"
  imageTitleInput.value = imageTitle.innerText
  imageTitle.replaceWith(imageTitleInput)
  imageTitleInput.focus()
  imageTitleInput.onblur = (e) => {
    const imageTitleInput = e.target
    const imageTitle = document.createElement("h3")
    imageTitle.id = "imageTitle"
    imageTitle.innerText = imageTitleInput.value
    imageTitle.onclick = handleImageTitleClick
    imageTitleInput.replaceWith(imageTitle)
    currImage.title = imageTitleInput.value
  }
}

const handleClearAll = (e) => {
  e.preventDefault()
  e.stopPropagation()

  clearAllTags()
}

const handleImageInput = (e) => {
  const imageInput = e.target
  const image = imageInput.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    const newImage = createNewImage(e.target.result)
    drawImage(newImage.src)
    redrawCanvas(newImage)
  }
  reader.readAsDataURL(image)
}

const handleMouseDown = (e) => {
  e.preventDefault()
  e.stopPropagation()

  // save the starting x/y of the rectangle
  startX = parseInt(e.clientX - offsetX)
  startY = parseInt(e.clientY - offsetY)

  // if the mouse is within an existing rectangle, set the draggedRect to that rectangle
  if (currImage.tags.length > 0) {
    currImage.tags.forEach((rect) => {
      if (startX >= rect.x && startX <= rect.x + rect.width && startY >= rect.y && startY <= rect.y + rect.height) {
        draggedRect = rect
      }
    })
  }

  if (!draggedRect) {
    isDown = true
  }
}

const handleMouseUp = (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (draggedRect !== null) {
    draggedRect = null
    updateCurrImage()
    return
  }

  isDown = false

  rectCount = currImage.tagCount++

  caption = `Tag ${rectCount}`

  // only add the rectangle if the width/height are non-zero
  threshold = 5
  width = parseInt(e.clientX - offsetX) - startX
  height = parseInt(e.clientY - offsetY) - startY
  if ((width > threshold || width < -threshold) && (height > threshold || height < -threshold)) {
    var tag = {
      id: rectCount,
      x: startX,
      y: startY,
      width: Math.abs(width),
      height: Math.abs(height),
      caption: caption
    }
    ctx.fillText(caption, startX + 5, startY + 13)
    currImage.tags.push(tag)

    drawTagsList()
    updateCurrImage()
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

  if (draggedRect !== null) {
    // if the mouse is down, update the draggedRect's x/y values
    draggedRect.x = parseInt(e.clientX - offsetX)
    draggedRect.y = parseInt(e.clientY - offsetY)
    redrawCanvas(currImage)
  }

  if (!isDown) {
    return
  }

  // stroke color
  ctx.strokeStyle = "#2d92ff"

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX)
  mouseY = parseInt(e.clientY - offsetY)

  redrawCanvas(currImage)

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
document.getElementById("clearAll").addEventListener("click", function (e) {
  handleClearAll(e)
})
document.getElementById("imageInput").addEventListener("change", function (e) {
  handleImageInput(e)
})
document.getElementById("imageTitle").addEventListener("click", function (e) {
  handleImageTitleClick(e)
})
document.getElementById("backButton").addEventListener("click", function (e) {
  handleBackButtonClick(e)
})
document.getElementById("nextButton").addEventListener("click", function (e) {
  handleNextButtonClick(e)
})
document.getElementById("deleteButton").addEventListener("click", function (e) {
  handleDeleteButtonClick(e)
})
