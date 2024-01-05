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


function scanFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = window.innerWidth;
        canvas.width = window.innerHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            const location = code.location;
            const points=[]
            points.push(location.bottomLeftCorner)
            points.push(location.bottomRightCorner)
            points.push(location.topLeftCorner)
            points.push(location.topRightCorner)
            console.log(points)
            const { topLeft, topRight, bottomLeft, bottomRight, width, height }=findTopLeftCornerAndDimensions(points)
            console.log(topLeft)
        
            drawRectangle(topLeft, width, height);
            function drawRectangle(topLeft, width, height) {
                ctx.beginPath();
                ctx.rect(topLeft.x, topLeft.y, width, height);
                ctx.fillStyle = '#2137FC';
                ctx.globalAlpha = 0.15; // Độ trong suốt
                ctx.fill();
                ctx.globalAlpha = 1.0; // Đặt lại độ trong suốt để không ảnh hưởng đến các vẽ sau
            }
            alert(code.data)
        }
    }
    requestAnimationFrame(scanFrame);
}
// Giả định các tọa độ góc của mã QR


// Hàm để xác định tọa độ của tất cả các góc và kích thước của hình chữ nhật
function findTopLeftCornerAndDimensions(points) {
    // Tìm điểm gần tâm O nhất
    let nearestPoint = points.reduce((nearest, point) => {
        let nearestDistance = Math.sqrt(nearest.x * nearest.x + nearest.y * nearest.y);
        let pointDistance = Math.sqrt(point.x * point.x + point.y * point.y);
        return pointDistance < nearestDistance ? point : nearest;
    }, points[0]);
  
    // Sắp xếp các điểm theo y, sau đó theo x
    let sortedPoints = points.slice().sort((a, b) => a.y - b.y || a.x - b.x);

    // Góc trên cùng bên trái là điểm gần tâm O nhất
    let topLeft = nearestPoint;

    // Tìm các góc còn lại
    let remainingPoints = sortedPoints.filter(p => p !== topLeft);
    let topRight = remainingPoints.find(p => p.y === topLeft.y) || remainingPoints[0];
    let bottomLeft = remainingPoints.find(p => p.x === topLeft.x) || remainingPoints[1];
    let bottomRight = remainingPoints.find(p => p !== topRight && p !== bottomLeft) || remainingPoints[2];

    // Tính toán chiều rộng và chiều cao
    let width = Math.abs(topRight.x - topLeft.x);
    let height = Math.abs(bottomLeft.y - topLeft.y);

    return { topLeft, topRight, bottomLeft, bottomRight, width, height };
}