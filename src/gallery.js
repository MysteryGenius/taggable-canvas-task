const getFromLocalStorage = () => {
  if (localStorage.getItem("imageData")) {
    return JSON.parse(localStorage.getItem("imageData"))
  }
}

const renderGallery = () => {
  gallery = document.getElementById("gallery")
  imageData.forEach((image) => {
    const li = document.createElement("a")
    li.href = `./#${image.id}`
    li.classList.add("gallery-item")
    li.innerHTML = `
      <img src="${image.src}" height="300" width="300" class="gallery-image">
      <div>
        <h3>${image.title}</h3>
        <p>${image.tags.length} tags on the image</p>
      </div>
    `
    gallery.appendChild(li)
  })
}

imageData = getFromLocalStorage() || []
console.log(imageData)

renderGallery()
