function previewImage() {
    var file = document.getElementById('imgInput').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('originalImg').src = e.target.result;
        document.getElementById('originalImg').style.display = 'block'; // Menampilkan gambar asli
    };
    reader.readAsDataURL(file);
}


function encode() {
    var img = document.getElementById('originalImg');
    var text = document.getElementById('textInput').value;
    var canvas = document.getElementById('encodedCanvas');
    var ctx = canvas.getContext('2d');

    var maxWidth = 300; 
    var maxHeight = 300; 

    var ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    
    var binaryText = text.split('').map(function(char) {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');

    
    document.getElementById('binaryCode').textContent = binaryText;

   
    for (var i = 0; i < binaryText.length; i++) {
        var bit = binaryText[i];
        if (bit === '1') {
            data[i] = data[i] | 1; 
        } else {
            data[i] = data[i] & ~1; 
        }
    }

    ctx.putImageData(imgData, 0, 0);
    canvas.style.display = 'block'; 
    document.getElementById('downloadBtn').style.display = 'block'; 

    
    document.getElementById('originalTextInputEncode').value = text;
}


function decode() {
    var imgDecodeInput = document.getElementById('imgDecodeInput').files[0];
    var canvas = document.getElementById('encodedCanvas');
    var ctx = canvas.getContext('2d');
  
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;
            var binaryText = '';
            var buffer = '';

            
            for (var i = 0; i < data.length; i += 4) {
                for (var j = 0; j < 3; j++) { /
                    var bit = data[i + j] & 1; 
                    buffer += bit;
                    if (buffer.length === 8) {
                        var charCode = parseInt(buffer, 2);
                        if (charCode === 0) { 
                            
                            document.getElementById('decodedText').textContent = binaryText;
                            return;
                        }
                        binaryText += String.fromCharCode(charCode);
                        buffer = '';
                    }
                }
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imgDecodeInput);
}


function download() {
    var canvas = document.getElementById('encodedCanvas');
    var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    var link = document.createElement('a');
    link.download = 'encoded-image.png';
    link.href = image;
    link.click();
}