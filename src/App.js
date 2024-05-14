import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';

const App = () => {
  useEffect(() => {
    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource();

    const vector = new VectorLayer({
      source: source,
    });

    const map = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    const typeSelect = document.getElementById('type');

    let draw; // global so we can remove it later
    function addInteraction() {
      const value = typeSelect.value;
      if (value !== 'None') {
        draw = new Draw({
          source: source,
          type: typeSelect.value,
          freehand: true,
        });

        draw.on('drawend', (event) => {
          const geometry = event.feature.getGeometry();
          if (geometry instanceof LineString) {
            const coordinates = geometry.getCoordinates();
            console.log('Waypoints:', coordinates);
          } else if (geometry instanceof Polygon) {
            const coordinates = geometry.getCoordinates()[0]; // Get the outer ring coordinates
            console.log('Polygon Vertices:', coordinates);
          }
        });

        map.addInteraction(draw);
      }
    }

    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };

    addInteraction();

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div>
      <div id="map" className="map" style={{ width: '100%', height: '700px' }}></div>
      <form>
        <label htmlFor="type">Geometry type &nbsp;</label>
        <select id="type">
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
          <option value="None">None</option>
        </select>
      </form>
    </div>
  );
};

export default App;
