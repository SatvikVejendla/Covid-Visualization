import logo from './logo.svg';
import './App.css';

import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ThreeGlobe from "three-globe";

import React from 'react';

import countries from "./data/countries.json"
import earth_dark from "./data/earth-dark.jpg";
import covid_file from "./data/country_wise_latest.csv";

export default class App extends React.Component {


  componentDidMount() {
    const renderer = new THREE.WebGLRenderer();
    let covid_data;
    fetch(covid_file).then(res => res.text()).then(b => {

    b = b.split("\r\n");
    for(let i = 0; i < b.length; i++){
      b[i] = b[i].split(",")
    }

    covid_data = b;
    let arr = [];
      const Globe = new ThreeGlobe()
        .globeImageUrl(earth_dark)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
        .polygonSideColor(() => 'rgba(0, 200, 0, 0.9)')
        .polygonStrokeColor(() => '#111')
        .polygonAltitude((x) => {
          const name = x.properties.name;

          const country_data = covid_data.filter((x) => {
            if(x[0] == "US" && name == "United States of America"){ return true; }
            return x[0] == name;
          })[0]


          if(country_data){
            const confirmed = country_data[1];
            
            console.log(name + ": " + confirmed);
            arr.push(confirmed);

            const height = confirmed / 2442375 * 0.5;

            return height > 0.01 ? height: 0.01;
          }
          return 0.01;
        });
      
      
  
  
      // Setup renderer
      
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement);
  
      // Setup scene
      const scene = new THREE.Scene();
      scene.add(Globe);
      // Setup camera
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = window.innerWidth/ window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 500;
  
      // Add camera controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 250;
      controls.rotateSpeed = 1;
      controls.zoomSpeed = 0.6;
      controls.maxDistance = 500;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      
        

      window.addEventListener('resize', function() {
          renderer.setSize(window.innerWidth, window.innerHeight)
     });
    
      // Kick-off renderer
      (function animate() {
        // Frame cycle
        controls.update();
        renderer.render(scene, camera);

      
        requestAnimationFrame(animate);
      })();
    });
  }
  render() {

    return (
      <div>
        <div id="container"></div>
        <div id="group">
          <input id="b1" type="radio" name="type" value={1}/>
            <label>Confirmed</label>
            <br/>
            <input id="b2" type="radio" name="type" value={2}/>
            <label>Deaths</label>
            <br/>
            <input id="b3" type="radio" name="type" value={3}/>
            <label>Recovered</label>
        </div>
      </div>
    );
  }
}
