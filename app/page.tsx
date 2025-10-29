'use client';

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
import {
  useDynamicDatapoints,
  getGeoJsonData,
  heatmapLayer,
  initialViewState,
  mapStyleURL,
} from './heatmapConfig';

const TicketSpyHeatMap: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [heatmapOpacityMultiplier, setHeatmapOpacityMultiplier] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 1.) Supabase query for data
  const testData = useDynamicDatapoints();
  const geoJsonData = getGeoJsonData(testData);
  const adjustableHeatmap = React.useMemo(() => {
    // create a copy of heatmapLayer with adjusted opacity stops multiplied by the slider
    const mult = heatmapOpacityMultiplier;
    // avoid `any` by treating heatmapLayer as unknown and accessing paint as a Record
    const base = heatmapLayer as unknown as { paint?: Record<string, unknown> };
    const basePaint = base.paint ?? {};
    const newPaint: Record<string, unknown> = {
      ...basePaint,
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        0.48 * mult,
        8,
        0.36 * mult,
        15,
        0.2 * mult,
      ],
    };
    const newLayer = {
      ...(heatmapLayer as unknown as object),
      paint: newPaint,
    } as unknown as import('react-map-gl/maplibre').LayerProps;
    return newLayer;
  }, [heatmapOpacityMultiplier]);
  // TODO: validate testData in heatmapConfig.ts

  // TODO: check if user is logged in, non functional
  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
      // will change to phone login when we setup phone auth
      const email = `temp`;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setShowLoginModal(false);
      setIsLoggedIn(true);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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
          {/*login button routes to login page*/}
          <Link href="/auth/login" className={styles.loginButton}>
            log in
          </Link>
          {/*login button routes to sign up page*/}
          <Link href="/auth/sign-up">
            <button className={styles.signupButton}>create account</button>
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
        {/* opacity control: positioned over the map */}
        <div
          style={{
            position: 'absolute',
            top: 84,
            right: 16,
            background: 'rgba(255,255,255,0.9)',
            padding: '8px 10px',
            borderRadius: 8,
            zIndex: 1000,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'stretch',
            width: 180,
          }}
        >
          <label style={{ fontSize: 12, color: '#222' }}>
            Heatmap opacity: {Math.round(heatmapOpacityMultiplier * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={heatmapOpacityMultiplier}
            onChange={(e) => setHeatmapOpacityMultiplier(Number(e.target.value))}
            aria-label="Heatmap opacity"
          />
        </div>
        <Map
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyleURL}
          onLoad={(e) => {
            // set the existing style's background layer color so we don't cover tiles
            const map = e.target as unknown as {
              setPaintProperty?: (layer: string, prop: string, value: unknown) => void;
            };
            try {
              map.setPaintProperty?.('background', 'background-color', '#e6f7ff');
            } catch (err) {
              // ignore if background layer not present or setPaintProperty fails
            }
          }}
        >
          <Source id="tickets" type="geojson" data={geoJsonData}>
            <Layer {...adjustableHeatmap} />
          </Source>
        </Map>
      </div>

      {/* Instructions Modal */}
      {showInstructions && !isLoggedIn && (
        <div className={styles.modalOverlay}>
          <div className={styles.unauthInstructionsContent}>
            <button onClick={() => setShowInstructions(false)} className={styles.closeButton}>
              <X size={24} color="#999" />
            </button>

            <div className={styles.actionButtons}>
              <button className={styles.reportTicketButton}>report a ticket</button>
              <button className={styles.reportEnforcementButton}>
                report parking enforcement nearby
              </button>
            </div>

            <div className={styles.instructionsText}>
              <p>
                to <strong>mark where you parked</strong>, get{' '}
                <strong>notifications for tickets issued</strong> or{' '}
                <strong>parking enforcement spotted</strong> near your important locations, and{' '}
                <strong>bookmark your favorite parking spots:</strong>
              </p>
            </div>

            <div className={styles.authButtons}>
              <Link href="/welcome">
                <button className={styles.createAccountBtn}>create an account</button>
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
            <p className={styles.modalText}>EXAMPLE</p>
            <button onClick={() => setShowInstructions(false)} className={styles.modalButton}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.loginModalContent}>
            <button onClick={() => setShowLoginModal(false)} className={styles.closeButton}>
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

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
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
