const imageInput = document.getElementById("image-upload");
const logoInput = document.getElementById("logo-upload");
const generateBtn = document.getElementById("generate-btn");
const previewSection = document.getElementById("preview-section");

let logoImage = null;

logoInput.addEventListener("change", () => {
  const logoFile = logoInput.files[0];
  if (!logoFile) return;
  const reader = new FileReader();
  reader.onload = e => {
    logoImage = new Image();
    logoImage.src = e.target.result;
  };
  reader.readAsDataURL(logoFile);
});

generateBtn.addEventListener("click", () => {
  previewSection.innerHTML = "";

  if (!logoImage) {
    alert("Please upload a logo before generating watermarked images.");
    return;
  }

  const files = imageInput.files;
  if (!files.length) {
    alert("Please upload at least one image.");
    return;
  }

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const logoCanvas = document.createElement("canvas");
        logoCanvas.width = canvas.width;
        logoCanvas.height = canvas.height;
        const logoCtx = logoCanvas.getContext("2d");

        let posX = 50, posY = 50;

        logoImage.onload = () => {
          logoCtx.drawImage(logoImage, posX, posY, img.width / 6, img.height / 6);
        };
        logoCtx.drawImage(logoImage, posX, posY, img.width / 6, img.height / 6);

        canvas.addEventListener("mousedown", function startDrag(e) {
          function moveDrag(evt) {
            logoCtx.clearRect(0, 0, canvas.width, canvas.height);
            posX = evt.offsetX;
            posY = evt.offsetY;
            logoCtx.drawImage(logoImage, posX, posY, img.width / 6, img.height / 6);
          }

          function stopDrag() {
            canvas.removeEventListener("mousemove", moveDrag);
            canvas.removeEventListener("mouseup", stopDrag);
          }

          canvas.addEventListener("mousemove", moveDrag);
          canvas.addEventListener("mouseup", stopDrag);
        });

        ctx.drawImage(logoCanvas, 0, 0);

        const downloadLink = document.createElement("a");
        downloadLink.textContent = "Download Watermarked Image";
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = "watermarked-" + file.name;
        downloadLink.className = "download-btn";

        previewSection.appendChild(canvas);
        previewSection.appendChild(downloadLink);
      };
    };
    reader.readAsDataURL(file);
  });
});
