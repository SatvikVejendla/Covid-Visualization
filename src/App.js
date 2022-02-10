import logo from './logo.svg';
import './App.css';

import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ThreeGlobe from "three-globe";

import React from 'react';

import countries from "./data/countries.json"
import earth_night from "./data/earth-night.jpg";
import covid_file from "./data/country_wise_latest.csv";

export default class App extends React.Component {


  constructor() {
    super()
    this.state = { globe: null }

    this.onClick = this.onClick.bind(this);
  }

  updateSelection(val){
    let covid_data;
    fetch(covid_file).then(res => res.text()).then(b => {

      b = b.split("\r\n");
      for(let i = 0; i < b.length; i++){
        b[i] = b[i].split(",")
      }
  
      covid_data = b;

      let column = covid_data.map(i => parseInt(i[val])).slice(1);
      let max_val = column[0];

      for(let j = 0; j < column.length; j++){
        if(column[j] > max_val){
          max_val = column[j]
        }
      }
    
      this.state.globe.polygonAltitude((x) => {
        const name = x.properties.name;

        const country_data = covid_data.filter((x) => {
          if(x[0] === "US" && name === "United States of America"){ return true; }
          return x[0] === name;
        })[0]


        if(country_data){
          const confirmed = country_data[val];
          
          const height = confirmed / max_val * 0.75;

          return height > 0.01 ? height: 0.01;
        }
        return 0.01;
      })
    })
  }

  onClick(e) {
    this.updateSelection(e.target.value);

  }
  componentDidMount() {
    const renderer = new THREE.WebGLRenderer();
    
      const Globe = new ThreeGlobe()
        .globeImageUrl(earth_night)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor(() => 'rgba(0, 0, 0, 1)')
        .polygonSideColor(() => 'rgba(200, 0, 0, 0.9)')
        .polygonStrokeColor(() => '#fff')
        .customThreeObject(d => new THREE.Mesh(
          new THREE.SphereBufferGeometry(d.radius),
          new THREE.MeshLambertMaterial({ color: d.color })
      ))

      this.setState({globe: Globe})
      this.updateSelection(1);
      
      
      
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement);
  
      
      const scene = new THREE.Scene();
      scene.add(Globe);
      scene.add(new THREE.AmbientLight(0xffffff));
      scene.add(new THREE.DirectionalLight(0xffffff, 1));
      
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = window.innerWidth/ window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 500;
  
      
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
    
      (function animate() {
        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      })();
    
  }
  render() {

    return (
      <div>
        <div id="container"></div>
        <div id="title">COVID Visualization</div>
        <div id="group">
          <input id="b1" type="radio" name="type" value={1} defaultChecked onClick={this.onClick}/>
            <label>Confirmed</label>
            <br/>
            <input id="b2" type="radio" name="type" value={2} onClick={this.onClick}/>
            <label>Deaths</label>
            <br/>
            <input id="b3" type="radio" name="type" value={3} onClick={this.onClick}/>
            <label>Recovered</label>
            <br/>            
            <input id="b4" type="radio" name="type" value={4} onClick={this.onClick}/>
            <label>Active</label>
        </div>
      </div>
    );
  }
}
