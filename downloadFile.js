const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');


module.exports = function(url, path){
    const file = fs.createWriteStream(path);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish',() => {
            file.close();
            console.log('Download Completed'); 
        })
    });
}