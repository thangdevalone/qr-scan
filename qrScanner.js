function initQRScanner() {
    const video = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');

    // Adjust these constraints for 1080p at 60fps
    const constraints = {
        video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 }
        }
    };

    // Access the camera and start video stream
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            scanQRCode();
        })
        .catch(function(err) {
            console.error("Error accessing the camera", err);
        });

    function scanQRCode() {
        requestAnimationFrame(scanQRCode);
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            console.log("QR Code detected: ", code.data);
            // Handle the QR code result
            // For example, redirect to a URL or display the result on the page
        }
    }
}
