'use client';

import React, { useState } from 'react';
import { Menu, Info, Check, X } from 'lucide-react';
import Image from 'next/image';
import logo from './logo.png';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';
import { CarIcon, CarIcon2 } from '../components/ui/icons/car-icon';
import { ProfileIcon } from '../components/ui/icons/profile-icon';
import { HeartIcon } from '../components/ui/icons/heart-icon';
import { TicketIcon2 } from '@/components/ui/icons/ticket-icon';
import { SightingIcon } from '@/components/ui/icons/sighting-icon';
import { MapPin } from '../components/map/MapPin';
import FilterPanel from '../components/FilterPanel';
import { useUserParkingSessions } from '@/lib/hooks/useParkingSessionTable';
import { useUserBookmarkedLocations } from '@/lib/hooks/useBookmarkedLocations';
import { filterValidDataPoints } from '@/lib/utils/mapUtils';
import { filterTickets, Filters } from '@/lib/utils/filterTickets';
import { getGeoJsonData, heatmapLayer, initialViewState, mapStyleURL } from './heatmapConfig';
import { useTicketTable } from '@/lib/hooks/useTicketTable';
import { useEnforcementSightingTable } from '@/lib/hooks/useEnforcementSightingTable';

const TicketSpyHeatMap: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [heatmapOpacityMultiplier, setHeatmapOpacityMultiplier] = useState(0.9);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [showTicketReportModal, setShowTicketReportModal] = useState(false);
  const [ticketDateIssued, setTicketDateIssued] = useState('');
  const [ticketTimeIssued, setTicketTimeIssued] = useState('');
  const [ticketViolationType, setTicketViolationType] = useState('');
  const [reportLocation, setReportLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEnforcementSuccessToast, setShowEnforcementSuccessToast] = useState(false);
  const [showEnforcementErrorToast, setShowEnforcementErrorToast] = useState(false);
  const [enforcementErrorMessage, setEnforcementErrorMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showEnforcementConfirm, setShowEnforcementConfirm] = useState(false);
  const [enforcementLocation, setEnforcementLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [enforcementSubmitting, setEnforcementSubmitting] = useState(false);
  const [transientEnforcements, setTransientEnforcements] = useState<
    { id: string; lat: number; lng: number; expiresAt: number }[]
  >([]);
  const [mapZoom, setMapZoom] = useState<number>(initialViewState.zoom ?? 12);

  // Add a transient enforcement marker that auto-removes after `ttlMs` (default 1 hour)
  const addTransientEnforcement = (lat: number, lng: number, ttlMs = 1000 * 60 * 60) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const expiresAt = Date.now() + ttlMs;
    setTransientEnforcements((s) => [...s, { id, lat, lng, expiresAt }]);
    // schedule removal
    setTimeout(() => {
      setTransientEnforcements((s) => s.filter((m) => m.id !== id));
    }, ttlMs);
  };
  const router = useRouter();

  // filters state (client-side representation)
  const [filters, setFilters] = useState<Filters>({
    timeRange: { amount: 1, unit: 'months' },
    weekdays: { monThu: true, friSun: true },
    timesOfDay: { morning: true, afternoon: true, night: true },
  });

  // Pass only the server-applicable portion (timeRange) to the hook so Supabase
  // performs a date cutoff when possible to reduce payload size.
  const serverFilters: Pick<Filters, 'timeRange'> = { timeRange: filters.timeRange };

  const { data: ticketRows = [], refetch: refetchTickets } = useTicketTable(serverFilters as any);
  const { refetch: refetchParkingSessions } = useUserParkingSessions(userId || '');
  const { refetch: refetchBookMarks } = useUserBookmarkedLocations(userId || '');
  const { data: enforcementRows = [], refetch: refetchEnforcement } = useEnforcementSightingTable();

  // apply remaining filters client-side (weekday / time-of-day) against rows returned
  // from the server-side query above
  const filteredDataPoints = React.useMemo(
    () => filterTickets(ticketRows as any, filters),
    [ticketRows, filters]
  );
  const geoJsonData = React.useMemo(() => getGeoJsonData(filteredDataPoints), [filteredDataPoints]);
  const adjustableHeatmap = React.useMemo(() => {
    const mult = heatmapOpacityMultiplier;
    // avoid `any` by treating heatmapLayer as unknown and accessing paint as a Record
    const base = heatmapLayer as unknown as { paint?: Record<string, unknown> };
    const basePaint = base.paint ?? {};
    // baseline stops (existing visual defaults at mult === 0)
    const baseline0 = 0.48;
    const baseline8 = 0.36;
    const baseline15 = 0.2;
    // lerp from base->1 then scale by mult so that:
    // mult=0 => 0.0, mult=1 => 1.0, and intermediate values blend smoothly.
    const lerpToOne = (baseVal: number, t: number) => baseVal * (1 - t) + 1 * t;
    const computeStop = (baseVal: number, t: number) => t * lerpToOne(baseVal, t);
    const newPaint: Record<string, unknown> = {
      ...basePaint,
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        computeStop(baseline0, mult),
        8,
        computeStop(baseline8, mult),
        15,
        computeStop(baseline15, mult),
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
      // Set username from session if available
      const user = session?.user;
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.id);

        const { data } = await supabase
          .from('users')
          .select('display_name')
          .eq('user_id', user.id)
          .single();

        setUsername(data?.display_name || user.email || user.phone || 'Anonymous');
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
    };
    checkAuth();
  }, []);

  // Filters panel visibility
  const [showFilters, setShowFilters] = useState(false);

  // lazy import of FilterPanel component to keep top of file clean
  // (component file lives under components/FilterPanel.tsx)
  // import at top of render to avoid affecting server bundle
  // (we're in a client component so it's fine to import normally)
  // -- actual import placed below in the render area

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

  // Handle bookmark location
  const handleBookmarkLocation = async () => {
    if (!pinLocation || !userId) return;

    try {
      const response = await fetch('/api/bookmark-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          latitude: pinLocation.lat,
          longitude: pinLocation.lng,
        }),
      });

      if (response.ok) {
        refetchBookMarks();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        const result = await response.json();
        setErrorMessage(result.error || 'Failed to bookmark location');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error bookmarking location:', error);
      setErrorMessage('Network error: Failed to bookmark location');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }

    setPinLocation(null);
  };

  // Handle parking session
  const handleParkingSession = async () => {
    if (!pinLocation || !userId) return;

    try {
      const response = await fetch('/api/new-parking-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          latitude: pinLocation.lat,
          longitude: pinLocation.lng,
        }),
      });

      if (response.ok) {
        refetchParkingSessions();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        const result = await response.json();
        setErrorMessage(result.error || 'Failed to create parking session');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error creating parking session:', error);
      setErrorMessage('Network error: Failed to create parking session');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }

    setPinLocation(null);
  };

  {
    /* MapPinsLayer — renders pins for parked cars + bookmarks */
  }
  function MapPinsLayer({ userId }: { userId: string }) {
    // fetch raw data from supabase for that userid
    const { data: bookmarkData } = useUserBookmarkedLocations(userId);
    const { data: carData } = useUserParkingSessions(userId);

    // convert bookmark records to pin points in heart shape
    const bookmarkPoints = filterValidDataPoints(
      (bookmarkData ?? []).map((row) => ({
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        type: 'heart',
        id: row.bookmark_id,
      }))
    );

    //convert parking session record for given user to pin point in car shape
    const carPoints = filterValidDataPoints(
      (carData ?? []).map((row) => ({
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        type: 'car',
        id: row.parking_session_id,
      }))
    );

    const allPins = [...bookmarkPoints, ...carPoints];
    // render each point as a MapPin with the corresponding icon
    return (
      <>
        {allPins.map((point, i) => (
          <MapPin
            key={i}
            latitude={point.latitude}
            longitude={point.longitude}
            icon={point.type === 'car' ? <CarIcon /> : <HeartIcon />}
            type={point.type}
            id={point.id}
            userId={userId}
            onDelete={() => {
              // Refetch both bookmarks and parking sessions when any item is deleted
              refetchBookMarks();
              refetchParkingSessions();
            }}
          />
        ))}
      </>
    );
  }

  // `refetchEnforcement` is provided by the hook above; this placeholder removed.

  return (
    <div className={styles.container}>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className={styles.successToast}>
          <Check size={20} />
          <span>Ticket reported successfully!</span>
        </div>
      )}
      {/* Error Toast */}
      {showErrorToast && (
        <div className={styles.errorToast}>
          <X size={20} />
          <span>{errorMessage}</span>
        </div>
      )}
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
            onClick={() => {
              setShowInstructions(!showInstructions);
              setPinLocation(null);
            }}
            className={styles.instructionsButton}
          >
            <Info size={18} />
            <span>instructions</span>
          </button>

          {/* Check if user is logged in */}
          {isLoggedIn ? (
            <Link href="profile/" className={styles.profileButtonGroup}>
              <ProfileIcon size={46} />
              <span>{username}</span>
            </Link>
          ) : (
            <>
              {/*login button routes to login page*/}
              <Link href="/auth/login" className={styles.loginButton}>
                log in
              </Link>
              {/*login button routes to sign up page*/}
              <Link href="/auth/sign-up">
                <button className={styles.signupButton}>create account</button>
              </Link>
            </>
          )}
        </div>
      </header>
      {/* Filters Button */}
      <button
        className={styles.filtersButton}
        onClick={() => {
          setShowFilters(true);
        }}
        aria-expanded={showFilters}
        aria-controls="filters-panel"
      >
        <Menu size={20} />
        <span>filters</span>
      </button>
      {/* Filter side panel */}
      <FilterPanel
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={(f) => {
          setFilters(f);
        }}
      />
      {/* MapLibre Map */}
      <div className={styles.mapContainer}>
        {/* opacity control: positioned over the map */}
        <div
          style={{
            position: 'absolute',
            top: '1.9rem',
            left: 18,
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
          <label className={styles.sliderLabel}>
            heatmap opacity: {Math.round(heatmapOpacityMultiplier * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={heatmapOpacityMultiplier}
            onChange={(e) => setHeatmapOpacityMultiplier(Number(e.target.value))}
            aria-label="heatmap opacity"
            className={styles.slider}
            style={{
              background: `linear-gradient(90deg, var(--accent, #7C5CFF) ${Math.round(
                heatmapOpacityMultiplier * 100
              )}%, #E6EEF3 ${Math.round(heatmapOpacityMultiplier * 100)}%)`,
            }}
          />
        </div>
        <Map
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyleURL}
          onMove={(e) => {
            try {
              setMapZoom(e.viewState?.zoom ?? mapZoom);
            } catch (err) {
              // ignore
            }
          }}
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
          onClick={(e) => {
            setPinLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
            setShowInstructions(false);
          }}
        >
          <Source id="tickets" type="geojson" data={geoJsonData}>
            <Layer {...adjustableHeatmap} />
          </Source>
          {pinLocation && (
            <Marker longitude={pinLocation.lng} latitude={pinLocation.lat} anchor="bottom">
              <div className={styles.mapMarkerWrapper}>
                <svg viewBox="0 0 24 24" className={styles.mapMarkerSvg}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" fill="#fff" />
                </svg>
              </div>
            </Marker>
          )}
          {/* Render ticket + car pins on top of heatmap if user is logged*/}
          {userId && <MapPinsLayer userId={userId} />}
          {/* Transient enforcement markers (temporary pins that auto-remove after 1 hour) */}
          {transientEnforcements.map((m) => {
            // Compute pixel sizes so the whole marker scales down when zoomed out
            const outerBase = 56; // px at reference zoom
            const outer = Math.round(Math.min(Math.max(outerBase + (mapZoom - 12) * 6, 28), 80));
            const inner = Math.round(outer * 0.78);
            const iconSize = Math.round(inner * 0.74);

            return (
              <Marker key={m.id} longitude={m.lng} latitude={m.lat} anchor="bottom">
                <div
                  className={styles.transientMarker}
                  style={{ width: outer, height: outer, marginBottom: Math.round(outer * 0.14) }}
                >
                  <div
                    className={styles.transientMarkerInner}
                    style={{ width: inner, height: inner, transform: 'translateY(-2px)' }}
                  >
                    <SightingIcon size={iconSize} />
                  </div>
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>
      {/* Instructions Modal (Logged In) */}
      {showInstructions && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowInstructions(false)}
          role="presentation"
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>how to use ticketspy</h2>
              <button
                type="button"
                aria-label="Close instructions"
                onClick={() => setShowInstructions(false)}
                className={styles.modalCloseBtn}
              >
                <X />
              </button>
            </header>

            <div className={styles.modalBody}>
              <section>
                <h3>Heatmap overview</h3>
                <p>
                  This map displays a heatmap of parking ticket density based on real user reports.
                </p>
              </section>

              <section>
                <h3>Reporting a parking ticket you received</h3>
                <ol>
                  <li>
                    1. Click the location on the map where you got the ticket (as close as possible)
                  </li>
                  <li>
                    2. Select <em>“report a ticket”</em>
                  </li>
                  <li>3. Enter the date and time of the ticket issued, and violation type</li>
                  <li>
                    4. Click <em>submit</em> and your report will appear on the map!
                  </li>
                </ol>
              </section>

              <section>
                <h3>Reporting parking enforcement you spotted</h3>
                <ol>
                  <li>1. Click the location where you saw the parking enforcement officer</li>
                  <li>
                    2. Select <em>“report parking enforcement nearby”</em>
                  </li>
                  <li>3. Confirm in popup to submit the report</li>
                </ol>
              </section>

              <section>
                <h3>
                  Start a parking session + receive notifs for tickets/parking enforcement near your
                  car
                </h3>
                <ol>
                  <li>1. Create an account or log in.</li>
                  <li>
                    2. Select your parking spot on the map and click <em>“i just parked”</em>
                  </li>
                  <li>3. Open your profile (person icon, upper-right) </li>
                  <li>
                    {' '}
                    4. Enable notifications for tickets and parking enforcement reported within 0.5
                    miles of your parking spot (session)
                  </li>
                  <li>
                    5. To end your session: click the car icon → <em>“end parking session”</em>
                  </li>
                  <li>6. Optionally bookmark the spot when ending a session</li>
                </ol>
              </section>

              <section>
                <h3>
                  Bookmark favorite spots + receive notifs for tickets/parking enforcement near your
                  bookmarks{' '}
                </h3>
                <ol>
                  <li>1. Create an account or log in</li>
                  <li>
                    2. Select a spot and click <em>“bookmark this spot”</em>
                  </li>
                  <li>3. A heart icon marks the bookmarked spot.</li>
                  <li>4. Open your profile (person icon, upper-right)</li>
                  <li>
                    5. Enable notifications for tickets and parking enforcement reported within 0.5
                    miles of your bookmarked spots
                  </li>
                  <li>
                    6. To remove: click the heart icon → <em>“remove bookmark”</em>
                  </li>
                </ol>
              </section>
            </div>

            <footer className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className={styles.modalButton}
              >
                got it!
              </button>
            </footer>
          </div>
        </div>
      )}
      {/* Pin Location Popup Modal */}
      {pinLocation && (
        // for authenticated users
        <>
          {isLoggedIn ? (
            <div className={styles.pinPopupWrapper}>
              <div className={styles.authOptionsContent}>
                <button onClick={() => setPinLocation(null)} className={styles.closeButton}>
                  <X className={styles.mapIcon} />
                </button>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.reportTicketButton}
                    onClick={() => {
                      setShowTicketReportModal(true);
                      setReportLocation(pinLocation);
                      setPinLocation(null);
                    }}
                  >
                    <TicketIcon2 />
                    <span>report a ticket</span>
                  </button>

                  <button
                    className={styles.reportEnforcementButton}
                    onClick={() => {
                      console.debug('Open enforcement confirm for', pinLocation);
                      setEnforcementLocation(pinLocation);
                      setShowEnforcementConfirm(true);
                      setPinLocation(null);
                    }}
                  >
                    <SightingIcon />
                    report parking enforcement nearby
                  </button>

                  <button className={styles.bookmarkButton} onClick={handleBookmarkLocation}>
                    <HeartIcon color="white" />
                    <span>bookmark this spot</span>
                  </button>

                  <button className={styles.parkingSessionButton} onClick={handleParkingSession}>
                    <CarIcon2 />
                    <span>just parked here</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // for unauthenticated users
            <div className={styles.pinPopupWrapper}>
              <div className={styles.unauthInstructionsContent}>
                <button onClick={() => setPinLocation(null)} className={styles.closeButton}>
                  <X className={styles.mapIcon} />
                </button>

                <div className={styles.actionButtons}>
                  <button
                    className={styles.reportTicketButton}
                    onClick={() => {
                      setShowTicketReportModal(true);
                      setReportLocation(pinLocation);
                      setPinLocation(null);
                    }}
                  >
                    <TicketIcon2 />
                    <span>report a ticket</span>
                  </button>
                  <button
                    className={styles.reportEnforcementButton}
                    onClick={() => {
                      console.debug('Open enforcement confirm for', pinLocation);
                      setEnforcementLocation(pinLocation);
                      setShowEnforcementConfirm(true);
                      setPinLocation(null);
                    }}
                  >
                    <SightingIcon />
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
                      setPinLocation(null);
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
        </>
      )}
      {/* Ticket Report Modal */}
      {showTicketReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.ticketReportModalContent}>
            <button
              onClick={() => {
                setShowTicketReportModal(false);
                setTicketDateIssued('');
                setTicketTimeIssued('');
                setTicketViolationType('');
              }}
              className={styles.ticketReportCloseButton}
            >
              <X size={24} />
            </button>

            <h2 className={styles.ticketReportTitle}>Report a ticket:</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const ticketData = {
                  latitude: reportLocation?.lat,
                  longitude: reportLocation?.lng,
                  ticket_report_date: ticketDateIssued,
                  ticket_report_hour: ticketTimeIssued,
                  username: username || 'Anonymous',
                  violationType: ticketViolationType,
                };

                try {
                  console.log('Submitting ticket data:', ticketData);

                  const response = await fetch('/api/post-ticket', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                  });

                  console.log('Response status:', response.status);

                  const result = await response.json();
                  console.log('Response data:', result);

                  if (response.ok) {
                    console.log('Ticket submitted successfully:', result);
                    // Refresh the heatmap data to show the new ticket
                    refetchTickets();
                    // Show success toast
                    setShowSuccessToast(true);
                    setTimeout(() => setShowSuccessToast(false), 3000);
                  } else {
                    console.error('Error submitting ticket:', result);
                    setErrorMessage(result.error || 'Failed to submit ticket');
                    setShowErrorToast(true);
                    setTimeout(() => setShowErrorToast(false), 3000);
                  }
                } catch (error) {
                  console.error('Network error:', error);
                  setErrorMessage('Network error: Failed to submit ticket');
                  setShowErrorToast(true);
                  setTimeout(() => setShowErrorToast(false), 3000);
                }

                setShowTicketReportModal(false);
                setTicketDateIssued('');
                setTicketTimeIssued('');
                setTicketViolationType('');
                setReportLocation(null);
              }}
              className={styles.ticketReportForm}
            >
              <div className={styles.ticketReportFormGroup}>
                <label className={styles.ticketReportLabel}>Date issued:</label>
                <input
                  type="date"
                  className={styles.ticketReportInput}
                  value={ticketDateIssued}
                  onChange={(e) => setTicketDateIssued(e.target.value)}
                  required
                />
              </div>

              <div className={styles.ticketReportFormGroup}>
                <label className={styles.ticketReportLabel}>Time issued:</label>
                <input
                  type="time"
                  className={styles.ticketReportInput}
                  value={ticketTimeIssued}
                  onChange={(e) => setTicketTimeIssued(e.target.value)}
                  required
                />
              </div>

              <div className={styles.ticketReportFormGroup}>
                <label className={styles.ticketReportLabel}>Violation type:</label>
                <input
                  type="text"
                  className={styles.ticketReportInput}
                  value={ticketViolationType}
                  onChange={(e) => setTicketViolationType(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.ticketReportSubmitButton}>
                <Check size={20} />
                <span>Submit ticket report</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Enforcement toasts */}
      {showEnforcementSuccessToast && (
        <div className={styles.successToast}>
          <Check size={20} />
          <span>Enforcement reported successfully!</span>
        </div>
      )}
      {showEnforcementErrorToast && (
        <div className={styles.errorToast}>
          <X size={20} />
          <span>{enforcementErrorMessage}</span>
        </div>
      )}
      {/* Enforcement Confirm Modal (centered) */}
      {showEnforcementConfirm && enforcementLocation && (
        <div className={styles.modalOverlay}>
          <div className={styles.ticketReportModalContent}>
            <button
              onClick={() => {
                setShowEnforcementConfirm(false);
                setEnforcementLocation(null);
              }}
              className={styles.ticketReportCloseButton}
            >
              <X size={20} />
            </button>

            <h2 className={styles.ticketReportTitle}>
              Confirm parking enforcement officer sighting?
            </h2>

            <p style={{ marginTop: 8 }}>
              Are you sure you want to report a parking enforcement officer at (
              {enforcementLocation.lat.toFixed(5)}, {enforcementLocation.lng.toFixed(5)})?
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'center' }}>
              <button
                className={styles.enforcementNoButton}
                onClick={() => {
                  setShowEnforcementConfirm(false);
                  setEnforcementLocation(null);
                }}
              >
                <span style={{ marginRight: 8 }}>✖</span>
                no
              </button>

              <button
                type="button"
                className={styles.ticketReportSubmitButton}
                onClick={async () => {
                  if (!enforcementLocation) return;
                  setEnforcementSubmitting(true);
                  console.debug('Submitting enforcement:', enforcementLocation);
                  try {
                    const body = {
                      latitude: enforcementLocation.lat,
                      longitude: enforcementLocation.lng,
                      user_id: userId ?? null,
                      sighting_time: new Date().toISOString(),
                    };

                    const res = await fetch('/api/enforcement-sighting', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    });

                    const data = await res.json().catch(() => ({}));
                    console.debug('Enforcement response', res.status, data);

                    if (res.ok) {
                      // Add a transient marker for immediate visual feedback
                      try {
                        addTransientEnforcement(enforcementLocation.lat, enforcementLocation.lng);
                      } catch (e) {
                        // ignore
                      }
                      try {
                        await refetchEnforcement?.();
                      } catch (e) {
                        // ignore
                      }
                      setShowEnforcementConfirm(false);
                      setEnforcementLocation(null);
                      setShowEnforcementSuccessToast(true);
                      setTimeout(() => setShowEnforcementSuccessToast(false), 3000);
                    } else {
                      setEnforcementErrorMessage(data?.error || 'Failed to report enforcement');
                      setShowEnforcementErrorToast(true);
                      setTimeout(() => setShowEnforcementErrorToast(false), 3000);
                    }
                  } catch (err) {
                    console.error('Network error posting enforcement:', err);
                    setEnforcementErrorMessage('Network error: Failed to report enforcement');
                    setShowEnforcementErrorToast(true);
                    setTimeout(() => setShowEnforcementErrorToast(false), 3000);
                  } finally {
                    setEnforcementSubmitting(false);
                  }
                }}
                disabled={enforcementSubmitting}
              >
                <Check size={18} />
                <span style={{ marginLeft: 8 }}>
                  {enforcementSubmitting ? 'Submitting...' : 'Yes, report'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      Login Modal
      {showLoginModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.loginModalContent}>
            <button onClick={() => setShowLoginModal(false)} className={styles.closeButton}>
              <X className={styles.mapIcon} />
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
