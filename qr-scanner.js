const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
// Get the context with willReadFrequently set to true
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const qrResult = document.getElementById('qr-result');

navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "user", width: { ideal:  1920 },
        height: { ideal: 1080  },
    }
})
    .then(function (stream) {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanFrame);
    })
    .catch(function (error) {
        console.error("Error accessing the camera", error);
    });
let topLeft=0
let topRight=0
let bottomLeft=0
let bottomRight=0

function scanFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const location = code.location;
            bottomLeft = location.bottomLeftCorner;
            bottomRight = location.bottomRightCorner;
            topLeft = location.topLeftCorner;
            topRight = location.topRightCorner;
            const boxDetect = document.querySelector('.box-detect');
            boxDetect.style.left = `${topLeft.x}px`;
            boxDetect.style.top = `${topLeft.y}px`;
            boxDetect.style.width = `${topRight.x - topLeft.x}px`;
            boxDetect.style.height = `${bottomLeft.y - topLeft.y}px`;
            qrResult.textContent = code.data;
        }
    }
    requestAnimationFrame(scanFrame);
}
