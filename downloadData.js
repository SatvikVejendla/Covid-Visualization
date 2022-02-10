const downloadFile = require("./downloadFile.js");

downloadFile("https://unpkg.com/three-globe@2.21.4/example/img/earth-night.jpg", "src/data/earth-night.jpg");
downloadFile("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json", "src/data/countries.json")