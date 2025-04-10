
document.getElementById("generateBtn").addEventListener("click", async () => {
  const imageInput = document.getElementById("imageInput");
  const logoInput = document.getElementById("logoInput");
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";

  if (!logoInput.files[0]) {
    alert("Please upload a logo first.");
    return;
  }

  const logo = await loadImage(logoInput.files[0]);

  for (let imageFile of imageInput.files) {
    const image = await loadImage(imageFile);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
    const scale = 0.2;
    const logoWidth = image.width * scale;
    const logoHeight = logo.height * (logoWidth / logo.width);
    ctx.drawImage(logo, image.width - logoWidth - 10, image.height - logoHeight - 10, logoWidth, logoHeight);

    const dataURL = canvas.toDataURL("image/png");

    const previewDiv = document.createElement("div");
    previewDiv.classList.add("preview-item");

    const imgElement = document.createElement("img");
    imgElement.src = dataURL;

    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = `watermarked-${imageFile.name}`;
    downloadLink.textContent = "Download";
    downloadLink.classList.add("download-btn");

    previewDiv.appendChild(imgElement);
    previewDiv.appendChild(downloadLink);
    previewContainer.appendChild(previewDiv);
  }
});

function loadImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
