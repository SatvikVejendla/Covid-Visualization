const downloadFile = require("./downloadFile.js");

//downloadFile("https://raw.githubusercontent.com/vasturiano/three-globe/master/example/country-polygons/ne_110m_admin_0_countries.geojson", "src/data/countries.json")
downloadFile("https://unpkg.com/three-globe@2.21.4/example/img/earth-dark.jpg", "src/data/earth-dark.jpg");


downloadFile("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json", "src/data/countries.json")
