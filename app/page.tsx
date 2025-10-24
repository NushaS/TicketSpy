"use client";

import React, { useState } from 'react';
import { Menu, Info } from 'lucide-react';
import Image from 'next/image';
import logo from './logo.png';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import styles from './page.module.css';
import { geojsonData, heatmapLayer, initialViewState, mapStyleURL } from './heatmapConfig';

const TicketSpyHeatMap: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image 
            src={logo} 
            alt="TicketSpy Logo" 
            width={150} 
            height={50}
            priority
            className={styles.logo}
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className={styles.instructionsButton}
          >
            <Info size={18} />
            <span>instructions</span>
          </button>
          <Link href="/auth/login">
            <button className={styles.loginButton}>
              log in
            </button>
          </Link>
          <Link href="/auth/sign-up">
            <button className={styles.signupButton}>
              create account
            </button>
          </Link>
        </div>
      </header>

      {/* Filters Button */}
      <button className={styles.filtersButton}>
        <Menu size={20} />
        <span>filters</span>
      </button>

      {/* MapLibre Map */}
      <div className={styles.mapContainer}>
        <Map
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyleURL}
        >
          <Source id="tickets" type="geojson" data={geojsonData}>
            <Layer {...heatmapLayer} />
          </Source>
        </Map>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>How to Use TicketSpy</h2>
            <p className={styles.modalText}>
              The heat map shows ticket availability and pricing hotspots across the Seattle area. 
              Red areas indicate high-demand zones, while blue areas show lower activity.
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              className={styles.modalButton}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSpyHeatMap;
