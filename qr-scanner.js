const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
// Get the context with willReadFrequently set to true
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const qrResult = document.getElementById('qr-result');

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanFrame);
    })
    .catch(function(error) {
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
            qrResult.textContent = code.data;
        } else {
            qrResult.textContent = 'No QR code detected';
        }
    }
    requestAnimationFrame(scanFrame);
}
