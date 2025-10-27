"use client";

import React, { useState } from 'react';
import { Menu, Info, Check, X } from 'lucide-react';
import Image from 'next/image';
import logo from './logo.png';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';
import { getDynamicDatapoints, oldDataPoints, getGeoJsonData, heatmapLayer, initialViewState, mapStyleURL } from './heatmapConfig';

const TicketSpyHeatMap: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 1.) Supabase query for data
  const testData = getDynamicDatapoints();
  const geoJsonData = getGeoJsonData(testData);
  // TODO: validate testData in heatmapConfig.ts

  // Check if user is logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Convert phone number to email format
      const email = `${phoneNumber.replace(/\D/g, '')}@ticketspy.com`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setShowLoginModal(false);
      setIsLoggedIn(true);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
          <button 
            onClick={() => setShowLoginModal(true)}
            className={styles.loginButton}
          >
            log in
          </button>
          <Link href="/welcome">
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
          <Source id="tickets" type="geojson" data={geoJsonData}>
            <Layer {...heatmapLayer} />
          </Source>
        </Map>
      </div>

      {/* Instructions Modal */}
      {showInstructions && !isLoggedIn && (
        <div className={styles.modalOverlay}>
          <div className={styles.unauthInstructionsContent}>
            <button 
              onClick={() => setShowInstructions(false)}
              className={styles.closeButton}
            >
              <X size={24} color="#999" />
            </button>
            
            <div className={styles.actionButtons}>
              <button className={styles.reportTicketButton}>
                report a ticket
              </button>
              <button className={styles.reportEnforcementButton}>
                report parking enforcement nearby
              </button>
            </div>
            
            <div className={styles.instructionsText}>
              <p>
                To <strong>mark where you parked</strong>, get <strong>notifications for tickets issued</strong> or <strong>parking enforcement spotted</strong> near your important locations, and <strong>bookmark your favorite parking spots:</strong>
              </p>
            </div>
            
            <div className={styles.authButtons}>
              <Link href="/welcome">
                <button className={styles.createAccountBtn}>
                  create an account
                </button>
              </Link>
              <span className={styles.orText}>or</span>
              <button 
                onClick={() => {
                  setShowInstructions(false);
                  setShowLoginModal(true);
                }}
                className={styles.logInBtn}
              >
                log in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal (Logged In) */}
      {showInstructions && isLoggedIn && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>How to Use TicketSpy</h2>
            <p className={styles.modalText}>
              EXAMPLE
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.loginModalContent}>
            <button 
              onClick={() => setShowLoginModal(false)}
              className={styles.closeButton}
            >
              <X size={24} color="#999" />
            </button>
            
            <h2 className={styles.loginTitle}>log in</h2>
            
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.loginFormGroup}>
                <label className={styles.loginLabel}>phone number:</label>
                <input
                  type="tel"
                  className={styles.loginInput}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className={styles.loginFormGroup}>
                <label className={styles.loginLabel}>password:</label>
                <input
                  type="password"
                  className={styles.loginInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.loginError}>{error}</p>}

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                <Check size={20} />
                <span>{isLoading ? 'logging in...' : 'submit'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSpyHeatMap;
