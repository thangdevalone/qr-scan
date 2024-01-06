const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
// Get the context with willReadFrequently set to true
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const qrResult = document.getElementById('qr-result');
const scan = document.querySelector(".scan")

let topLeft = 0
let topRight = 0
let bottomLeft = 0
let bottomRight = 0


navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "environment"
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


function scanFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const location = code.location;
            const points = []
            points.push(location.bottomLeftCorner)
            points.push(location.bottomRightCorner)
            points.push(location.topLeftCorner)
            points.push(location.topRightCorner)

          
            alert(code.data)
        }
    }
    requestAnimationFrame(scanFrame);
}
// Giả định các tọa độ góc của mã QR



