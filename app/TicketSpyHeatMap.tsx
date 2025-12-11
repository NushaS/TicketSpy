'use client';

import React, { useRef, useState } from 'react';
import { Menu, Info } from 'lucide-react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import logo from './logo.png';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';
import { CarIcon3 } from '../components/ui/icons/car-icon';
import { ProfileIcon } from '../components/ui/icons/profile-icon';
import { HeartIcon2 } from '../components/ui/icons/heart-icon';
import {
  ParkingEnforcementIcon,
  computeEnforcementMarkerSizing,
} from '@/components/ui/icons/parking-enforcement';
import {
  AlertTicketIcon,
  computeTicketMarkerSizing,
} from '@/components/ui/icons/alert-ticket-icon';
import { MapPin } from '../components/map/MapPin';
import FilterPanel from '../components/FilterPanel';
import { useUserParkingSessions } from '@/lib/hooks/useParkingSessionTable';
import { useUserBookmarkedLocations } from '@/lib/hooks/useBookmarkedLocations';
import { filterValidDataPoints } from '@/lib/utils/mapUtils';
import { filterTickets, Filters } from '@/lib/utils/filterTickets';
import { getGeoJsonData, heatmapLayer, initialViewState, mapStyleURL } from './heatmapConfig';
import { useTicketTable } from '@/lib/hooks/useTicketTable';
import { useEnforcementSightingTable } from '@/lib/hooks/useEnforcementSightingTable';
import { ViolationType } from '@/lib/enums/ticketViolationType';
import TicketReportModal from '@/components/map/TicketReportModal';
import BookmarkNameModal from '@/components/map/BookmarkNameModal';
import Toast from '@/components/map/Toast';
import { PinActionPopup } from '@/components/map/PinActionPopup';
import { InstructionsModal } from '@/components/map/InstructionsModal';
import ThankYouModal from '@/components/map/ThankYouModal';
import {
  BookmarkActionsModal,
  BookmarkConversionModal,
  ParkingInfoModal,
} from '@/components/map/BookmarkParkingModals';

type MapCenter = { lat: number; lng: number };

type BookmarkPinState = {
  id: string;
  latitude: number;
  longitude: number;
  bookmarkName?: string | null;
};

type ParkingPinState = {
  id: string;
  latitude: number;
  longitude: number;
  startTime?: string | null;
};

type TicketSpyHeatMapProps = {
  initialCenter?: MapCenter | null;
  initialZoom?: number | null;
  alertMarker?:
    | (MapCenter & { label?: string; kind?: 'ticket' | 'enforcement'; icon?: React.ReactNode })
    | null;
};

const TicketSpyHeatMap: React.FC<TicketSpyHeatMapProps> = ({
  initialCenter = null,
  initialZoom = null,
  alertMarker = null,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [heatmapOpacityMultiplier, setHeatmapOpacityMultiplier] = useState(0.9);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [showTicketReportModal, setShowTicketReportModal] = useState(false);
  const [ticketDateIssued, setTicketDateIssued] = useState('');
  const [ticketTimeIssued, setTicketTimeIssued] = useState('');
  const [ticketViolationType, setTicketViolationType] = useState<ViolationType>(
    ViolationType.Other
  );
  const [reportLocation, setReportLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showEnforcementConfirm, setShowEnforcementConfirm] = useState(false);
  const [enforcementLocation, setEnforcementLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [enforcementSubmitting, setEnforcementSubmitting] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showTicketThankYouModal, setShowTicketThankYouModal] = useState(false);
  const [transientEnforcements, setTransientEnforcements] = useState<
    { id: string; lat: number; lng: number; expiresAt: number }[]
  >([]);
  const mapRef = useRef<import('react-map-gl/maplibre').MapRef | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(
    initialCenter ? (initialZoom ?? 17) : (initialViewState.zoom ?? 12)
  );
  // Compute marker sizes so they scale down when zoomed out but stay readable up close.
  const enforcementMarkerSizing = React.useMemo(
    () => computeEnforcementMarkerSizing(mapZoom),
    [mapZoom]
  );
  const ticketMarkerSizing = React.useMemo(() => computeTicketMarkerSizing(mapZoom), [mapZoom]);
  // Scale heatmap ticket dots based on zoom so they shrink when zoomed out.
  const heatmapRadiusStops = React.useMemo(() => {
    const minZoom = 2; // clamp zoom floor
    const maxZoom = 20; // clamp zoom ceiling
    const clamped = Math.min(Math.max(mapZoom, minZoom), maxZoom); // keep zoom within bounds
    const t = (clamped - minZoom) / (maxZoom - minZoom); // normalize to 0..1
    const scale = 0.35 + t * 0.9; // 35% size at min zoom, grows as you zoom in
    const base0 = 7; // base radius at zoom 0
    const base12 = 24; // base radius at zoom 12
    const base18 = 38; // base radius at zoom 18
    return {
      z0: Math.max(1, Math.round(base0 * scale)), // scaled radius at zoom 0
      z12: Math.max(1, Math.round(base12 * scale)), // scaled radius at zoom 12
      z18: Math.max(1, Math.round(base18 * scale)), // scaled radius at zoom 18
    };
  }, [mapZoom]);
  const [showBookmarkNameModal, setShowBookmarkNameModal] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarkLocation, setBookmarkLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isBookmarkSubmitting, setIsBookmarkSubmitting] = useState(false);
  const [activeBookmarkPin, setActiveBookmarkPin] = useState<BookmarkPinState | null>(null);
  const [activeParkingPin, setActiveParkingPin] = useState<ParkingPinState | null>(null);
  const [showBookmarkConversionModal, setShowBookmarkConversionModal] = useState(false);
  const [conversionLocation, setConversionLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isDeletingBookmark, setIsDeletingBookmark] = useState(false);
  const [isConvertingBookmark, setIsConvertingBookmark] = useState(false);
  const [isEndingParking, setIsEndingParking] = useState(false);
  const [isSavingBookmarkFromParking, setIsSavingBookmarkFromParking] = useState(false);
  // When the page is loaded via /alert, show a popup on the highlighted marker
  const [showAlertPopup, setShowAlertPopup] = useState<boolean>(!!alertMarker);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [selectedEnforcementPopup, setSelectedEnforcementPopup] = useState<{
    lat: number;
    lng: number;
    label?: string | null;
  } | null>(null);
  const alertKey = React.useMemo(() => {
    if (!alertMarker) return null;
    const kind = alertMarker.kind ?? 'alert';
    const lat = Number(alertMarker.lat).toFixed(6);
    const lng = Number(alertMarker.lng).toFixed(6);
    return `${kind}:${lat}:${lng}`;
  }, [alertMarker]);
  const prevAlertKeyRef = useRef<string | null>(null);
  const alertMarkerPosition = React.useMemo(() => {
    if (!alertMarker) return null;
    const lat = Number(alertMarker.lat);
    const lng = Number(alertMarker.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [alertMarker]);
  const alertIconSize = 36; // fixed size for alert markers (not scaled by zoom)
  const alertEnforcementKey =
    alertMarkerPosition && alertMarker?.kind === 'enforcement'
      ? `${alertMarkerPosition.lat.toFixed(6)}:${alertMarkerPosition.lng.toFixed(6)}`
      : null;
  const openAlertPopup = React.useCallback(() => {
    setShowAlertPopup(true);
    if (!alertKey) return;
    try {
      localStorage.removeItem(`alert-dismissed:${alertKey}`);
    } catch {
      // ignore storage errors
    }
  }, [alertKey]);
  const openEnforcementPopup = React.useCallback(
    (lat: number, lng: number, observedAt?: string | null) => {
      let label: string | null = null;
      if (observedAt) {
        const ts = new Date(observedAt).getTime();
        if (Number.isFinite(ts)) {
          label = `Spotted at ${new Date(ts).toLocaleString()}`;
        }
      }
      setSelectedEnforcementPopup({ lat, lng, label });
    },
    []
  );

  React.useEffect(() => {
    if (initialCenter && mapRef.current) {
      // Fly to the alert location with a tight zoom when provided
      mapRef.current.flyTo({
        center: [initialCenter.lng, initialCenter.lat],
        zoom: initialZoom ?? 17,
        duration: 800,
        essential: true,
      });
      setMapZoom(initialZoom ?? 17);
    }
    if (alertKey !== prevAlertKeyRef.current) {
      prevAlertKeyRef.current = alertKey;
      if (alertKey) {
        if (!alertMarker) {
          try {
            const stored = localStorage.getItem(`alert-dismissed:${alertKey}`);
            if (stored === 'true') {
              setShowAlertPopup(false);
              return;
            }
          } catch {
            // ignore storage errors
          }
        }
        setShowAlertPopup(true);
      } else {
        setShowAlertPopup(false);
      }
    }
  }, [initialCenter, initialZoom, alertKey, alertMarker]);

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

  // get user location to zoom into relevant map area
  const requestUserLocation = (map: any) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true,
        });
      },
      () => {
        // do nothing if user denies
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
  };
  const router = useRouter();

  // filters state (client-side representation)
  const [filters, setFilters] = useState<Filters>({
    timeRange: { amount: 3, unit: 'weeks' },
    weekdays: { monThu: true, friSun: true },
    timesOfDay: { morning: true, afternoon: true, night: true },
  });

  // Pass only the server-applicable portion (timeRange) to the hook so Supabase
  // performs a date cutoff when possible to reduce payload size.
  const serverFilters: Pick<Filters, 'timeRange'> = { timeRange: filters.timeRange };

  const { data: ticketRows = [], refetch: refetchTickets } = useTicketTable(serverFilters as any);
  const { data: carData = [], refetch: refetchParkingSessions } = useUserParkingSessions(
    userId || ''
  );
  const { data: bookmarkData = [], refetch: refetchBookMarks } = useUserBookmarkedLocations(
    userId || ''
  );
  const { data: enforcementSightings = [], refetch: refetchEnforcement } =
    useEnforcementSightingTable();

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
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        heatmapRadiusStops.z0,
        12,
        heatmapRadiusStops.z12,
        18,
        heatmapRadiusStops.z18,
      ],
    };
    const newLayer = {
      ...(heatmapLayer as unknown as object),
      paint: newPaint,
    } as unknown as import('react-map-gl/maplibre').LayerProps;
    return newLayer;
  }, [heatmapOpacityMultiplier, heatmapRadiusStops]);
  // TODO: validate testData in heatmapConfig.ts

  const resetTicketReportFields = () => {
    setTicketDateIssued('');
    setTicketTimeIssued('');
    setTicketViolationType(ViolationType.Other);
  };

  const handleTicketReportClose = () => {
    setShowTicketReportModal(false);
    resetTicketReportFields();
  };

  const handleTicketReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ticketData = {
      latitude: reportLocation?.lat,
      longitude: reportLocation?.lng,
      ticket_report_date: ticketDateIssued,
      ticket_report_hour: ticketTimeIssued,
      username: username || 'Anonymous',
      ticket_violation_type: ticketViolationType as ViolationType,
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
        // Show thank you modal
        setShowTicketThankYouModal(true);
        // Show success toast
        setSuccessMessage('Ticket reported successfully!');
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

    handleTicketReportClose();
    setReportLocation(null);
  };

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

  const openBookmarkNameModal = (location: { lat: number; lng: number } | null) => {
    if (!location) return;
    if (!userId) {
      setErrorMessage('Please log in to bookmark this spot');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    setBookmarkLocation(location);
    setBookmarkName('');
    setShowBookmarkNameModal(true);
    setPinLocation(null);
  };

  const closeBookmarkNameModal = () => {
    setShowBookmarkNameModal(false);
    setBookmarkName('');
    setBookmarkLocation(null);
  };

  // Handle bookmark location with a name
  const handleBookmarkLocation = async () => {
    const trimmedName = bookmarkName.trim();
    if (!bookmarkLocation || !userId || !trimmedName) return;

    setIsBookmarkSubmitting(true);
    try {
      const response = await fetch('/api/bookmark-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: bookmarkLocation.lat,
          longitude: bookmarkLocation.lng,
          name: trimmedName,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        refetchBookMarks();
        setSuccessMessage('Location bookmarked successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        setShowBookmarkNameModal(false);
        setBookmarkName('');
        setBookmarkLocation(null);
      } else {
        const msg =
          (result as any)?.error ||
          (response.status ? `Failed to bookmark location (status ${response.status})` : null);
        setErrorMessage(msg || 'Failed to bookmark location');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error bookmarking location:', error);
      setErrorMessage('Network error: Failed to bookmark location');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsBookmarkSubmitting(false);
    }
  };

  const handleDeleteBookmarkPin = React.useCallback(async () => {
    if (!activeBookmarkPin || isDeletingBookmark) return;

    setIsDeletingBookmark(true);
    try {
      const res = await fetch(`/api/delete-bookmark?id=${activeBookmarkPin.id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        refetchBookMarks();
        setActiveBookmarkPin(null);
        setSuccessMessage('Bookmark deleted successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setErrorMessage((data as any)?.error || 'Failed to delete bookmark');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      setErrorMessage('Network error: Failed to delete bookmark');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsDeletingBookmark(false);
    }
  }, [activeBookmarkPin, isDeletingBookmark, refetchBookMarks]);

  const handleConvertBookmarkToParking = React.useCallback(async () => {
    if (!activeBookmarkPin || isConvertingBookmark) return;

    setIsConvertingBookmark(true);
    try {
      const res = await fetch('/api/new-parking-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: activeBookmarkPin.latitude,
          longitude: activeBookmarkPin.longitude,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        refetchParkingSessions();
        refetchBookMarks();
        setActiveBookmarkPin(null);
        setSuccessMessage('Parking session started successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setErrorMessage((data as any)?.error || 'Failed to start parking session');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error converting bookmark to parking:', error);
      setErrorMessage('Network error: Failed to start parking session');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsConvertingBookmark(false);
    }
  }, [activeBookmarkPin, isConvertingBookmark, refetchBookMarks, refetchParkingSessions]);

  const handleEndParkingSession = React.useCallback(async () => {
    if (!activeParkingPin || isEndingParking) return;

    const { id, latitude, longitude } = activeParkingPin;
    setIsEndingParking(true);

    try {
      const res = await fetch(`/api/delete-parking-session?id=${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        refetchParkingSessions();
        setActiveParkingPin(null);
        const alreadyBookmarked = (bookmarkData ?? []).some(
          (b) =>
            Number(b.latitude) === Number(latitude) && Number(b.longitude) === Number(longitude)
        );
        if (!alreadyBookmarked) {
          setShowBookmarkConversionModal(true);
          setConversionLocation({ lat: latitude, lng: longitude });
        } else {
          setShowBookmarkConversionModal(false);
          setConversionLocation(null);
        }
        setSuccessMessage('Parking session ended');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setErrorMessage((data as any)?.error || 'Failed to end parking session');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error ending parking session:', error);
      setErrorMessage('Network error: Failed to end parking session');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsEndingParking(false);
    }
  }, [activeParkingPin, isEndingParking, refetchParkingSessions, bookmarkData]);

  const handleConvertEndedParkingToBookmark = React.useCallback(async () => {
    if (!conversionLocation || isSavingBookmarkFromParking) return;

    setIsSavingBookmarkFromParking(true);
    try {
      const res = await fetch('/api/bookmark-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: conversionLocation.lat,
          longitude: conversionLocation.lng,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        refetchBookMarks();
        setShowBookmarkConversionModal(false);
        setConversionLocation(null);
        setSuccessMessage('Location bookmarked successfully!');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setErrorMessage((data as any)?.error || 'Failed to bookmark location');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    } catch (error) {
      console.error('Error bookmarking from parking session:', error);
      setErrorMessage('Network error: Failed to bookmark location');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSavingBookmarkFromParking(false);
    }
  }, [conversionLocation, isSavingBookmarkFromParking, refetchBookMarks]);

  const handleDismissConversionModal = React.useCallback(() => {
    setShowBookmarkConversionModal(false);
    setConversionLocation(null);
  }, []);

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
          latitude: pinLocation.lat,
          longitude: pinLocation.lng,
        }),
      });

      if (response.ok) {
        refetchParkingSessions();
        setSuccessMessage('Parking session started successfully!');
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
  function MapPinsLayer({ bookmarkData, carData }: { bookmarkData: any[]; carData: any[] }) {
    // convert bookmark records to pin points in heart shape
    const bookmarkPoints = filterValidDataPoints(
      (bookmarkData ?? [])
        // don't show a bookmark if it has an active parking session
        .filter((bookmark) => {
          // check if there is a car parked at this bookmark's location
          const hasCarHere = (carData ?? []).some(
            (car) =>
              Number(bookmark.latitude) === Number(car.latitude) &&
              Number(bookmark.longitude) === Number(car.longitude)
          );
          return !hasCarHere;
        })
        .map((row) => ({
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          type: 'heart',
          id: row.bookmark_id,
          name: row.name ?? null,
        }))
    );

    //convert parking session record for given user to pin point in car shape
    const carPoints = filterValidDataPoints(
      (carData ?? []).map((row) => ({
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        type: 'car',
        id: row.parking_session_id,
        start_datetime: new Date(row.parking_session_start_datetime).toISOString(),
      }))
    );

    const allPins = React.useMemo(
      () => [...bookmarkPoints, ...carPoints],
      [bookmarkPoints, carPoints]
    );
    // render each point as a MapPin with the corresponding icon
    return (
      <>
        {allPins.map((point) => (
          <MapPin
            key={point.id}
            latitude={point.latitude}
            longitude={point.longitude}
            icon={point.type === 'car' ? <CarIcon3 /> : <HeartIcon2 />}
            type={point.type}
            id={point.id}
            {...(point.type === 'heart' ? { bookmarkName: point.name } : {})}
            {...(point.type === 'car' ? { startTime: point.start_datetime } : {})}
            onDismissPinActionPopup={() => {
              setShowPinPopup(false);
              setPinLocation(null);
            }}
            onOpenBookmarkActions={(pin) => {
              setActiveBookmarkPin(pin);
              setActiveParkingPin(null);
            }}
            onOpenEndParking={(pin) => {
              setActiveParkingPin(pin);
              setActiveBookmarkPin(null);
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
      {showSuccessToast && <Toast variant="success" message={successMessage || 'Success'} />}
      {/* Error Toast */}
      {showErrorToast && <Toast variant="error" message={errorMessage} />}
      <BookmarkNameModal
        isOpen={showBookmarkNameModal}
        name={bookmarkName}
        onNameChange={setBookmarkName}
        onClose={closeBookmarkNameModal}
        onSubmit={handleBookmarkLocation}
        isSubmitting={isBookmarkSubmitting}
      />
      <ParkingInfoModal
        open={!!activeParkingPin}
        startTime={activeParkingPin?.startTime}
        onClose={() => setActiveParkingPin(null)}
        onEndParking={handleEndParkingSession}
      />
      <BookmarkConversionModal
        open={showBookmarkConversionModal}
        onClose={handleDismissConversionModal}
        onDelete={handleDismissConversionModal}
        onConvertToBookmark={handleConvertEndedParkingToBookmark}
        onRequestNamedBookmark={
          conversionLocation
            ? () => {
                setShowBookmarkConversionModal(false);
                openBookmarkNameModal(conversionLocation);
              }
            : undefined
        }
        isDeleting={false}
        isConverting={isSavingBookmarkFromParking}
      />
      <BookmarkActionsModal
        open={!!activeBookmarkPin}
        onClose={() => setActiveBookmarkPin(null)}
        onDelete={handleDeleteBookmarkPin}
        onConvertToParking={handleConvertBookmarkToParking}
        isDeleting={isDeletingBookmark}
        isConverting={isConvertingBookmark}
        bookmarkName={activeBookmarkPin?.bookmarkName}
      />
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
          <span className={styles.logoTagline}>park easy.</span>
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
            <Link href="profile-settings/" className={styles.profileButtonGroup}>
              <ProfileIcon size={35} />
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
            background: 'rgba(255, 255, 255, 0.68)',
            padding: '8px 10px',
            borderRadius: 10,
            zIndex: 1000,
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
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
              background: `linear-gradient(90deg, #93A58D ${Math.round(
                heatmapOpacityMultiplier * 100
              )}%, #E6EEF3 ${Math.round(heatmapOpacityMultiplier * 100)}%)`,
            }}
          />
        </div>
        <Map
          key={
            alertMarker
              ? `${alertMarker.lat}-${alertMarker.lng}-${alertMarker.kind ?? 'alert'}`
              : 'base-map'
          }
          ref={mapRef}
          initialViewState={
            initialCenter
              ? {
                  longitude: initialCenter.lng,
                  latitude: initialCenter.lat,
                  zoom: initialZoom ?? 17,
                }
              : initialViewState
          }
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyleURL}
          onMove={(e) => {
            try {
              setMapZoom(e.viewState?.zoom ?? mapZoom);
            } catch {
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
            } catch {
              // ignore if background layer not present or setPaintProperty fails
            }
            // Only auto-locate when not viewing a deep-link alert
            if (!initialCenter && !alertMarker) {
              requestUserLocation(map);
            }
          }}
          onClick={(e) => {
            // Center the map on the clicked point for easier pin placement
            try {
              const targetZoom = Math.max(mapZoom, 16); // zoom in when clicking far out
              mapRef.current?.flyTo({
                center: [e.lngLat.lng, e.lngLat.lat],
                zoom: targetZoom,
                essential: true,
              });
              setMapZoom(targetZoom);
            } catch {
              // ignore flyTo errors
            }
            setPinLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
            setShowInstructions(false);
            setShowPinPopup(true);
          }}
        >
          <Source id="tickets" type="geojson" data={geoJsonData}>
            <Layer {...adjustableHeatmap} />
          </Source>
          {/* Alert marker (from /alert) */}
          {alertMarker && alertMarkerPosition && (
            <>
              <Marker
                longitude={alertMarkerPosition.lng}
                latitude={alertMarkerPosition.lat}
                anchor="bottom"
              >
                <div
                  className={styles.mapMarkerWrapper}
                  title={alertMarker.label ?? 'Alert'}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    openAlertPopup();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      openAlertPopup();
                    }
                  }}
                >
                  {alertMarker.icon ? (
                    alertMarker.icon
                  ) : alertMarker.kind === 'enforcement' ? (
                    <ParkingEnforcementIcon size={alertIconSize} />
                  ) : alertMarker.kind === 'ticket' ? (
                    <AlertTicketIcon size={alertIconSize} />
                  ) : null}
                </div>
              </Marker>
              {showAlertPopup && (
                <Popup
                  longitude={alertMarkerPosition.lng}
                  latitude={alertMarkerPosition.lat}
                  anchor="top"
                  className="ts-popup"
                  onClose={() => {
                    setShowAlertPopup(false);
                    if (alertKey) {
                      try {
                        localStorage.setItem(`alert-dismissed:${alertKey}`, 'true');
                      } catch {
                        // ignore storage errors
                      }
                    }
                  }}
                  closeButton
                  closeOnClick={false}
                >
                  <div style={{ maxWidth: 220 }}>
                    <strong>
                      {alertMarker.kind === 'enforcement'
                        ? 'Parking enforcement spotted'
                        : 'Ticket'}
                    </strong>
                    {alertMarker.label ? (
                      <div style={{ marginTop: 4 }}>{alertMarker.label}</div>
                    ) : null}
                  </div>
                </Popup>
              )}
            </>
          )}
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
          {userId && <MapPinsLayer bookmarkData={bookmarkData} carData={carData} />}
          {/* Persistent enforcement sightings from Supabase */}
          {(enforcementSightings as any[]).map((sighting, idx) => {
            const lat = Number((sighting as any)?.latitude);
            const lng = Number((sighting as any)?.longitude);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            const coordKey = `${lat.toFixed(6)}:${lng.toFixed(6)}`;
            if (alertEnforcementKey && coordKey === alertEnforcementKey) return null;
            const observedAt =
              (sighting as any)?.enforcement_report_time ??
              (sighting as any)?.sighting_time ??
              (sighting as any)?.created_at ??
              null;
            if (observedAt) {
              const ts = new Date(observedAt).getTime();
              if (!Number.isFinite(ts)) return null;
              const oneHourAgo = Date.now() - 1000 * 60 * 60;
              if (ts < oneHourAgo) return null;
            }
            const key =
              (sighting as any)?.enforcement_id ??
              (sighting as any)?.enforcement_sighting_id ??
              (sighting as any)?.id ??
              idx;
            return (
              <Marker key={key} longitude={lng} latitude={lat} anchor="bottom">
                <div
                  className={styles.transientMarker}
                  style={{
                    width: enforcementMarkerSizing.outer,
                    height: enforcementMarkerSizing.outer,
                    marginBottom: enforcementMarkerSizing.offset,
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEnforcementPopup(lat, lng, observedAt);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      openEnforcementPopup(lat, lng, observedAt);
                    }
                  }}
                >
                  <div
                    className={styles.transientMarkerInner}
                    style={{
                      width: enforcementMarkerSizing.inner,
                      height: enforcementMarkerSizing.inner,
                      transform: 'translateY(-2px)',
                    }}
                  >
                    <ParkingEnforcementIcon size={enforcementMarkerSizing.icon} />
                  </div>
                </div>
              </Marker>
            );
          })}
          {selectedEnforcementPopup && (
            <Popup
              longitude={selectedEnforcementPopup.lng}
              latitude={selectedEnforcementPopup.lat}
              anchor="top"
              className="ts-popup"
              onClose={() => setSelectedEnforcementPopup(null)}
              closeButton
              closeOnClick={false}
            >
              <div style={{ maxWidth: 220 }}>
                <strong>Parking enforcement spotted</strong>
                {selectedEnforcementPopup.label ? (
                  <div style={{ marginTop: 4 }}>{selectedEnforcementPopup.label}</div>
                ) : null}
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
      {/* Pin Location Popup Modal */}
      {pinLocation && showPinPopup && (
        <PinActionPopup
          isLoggedIn={isLoggedIn}
          pinLocation={pinLocation}
          onClose={() => {
            setShowPinPopup(false);
            setPinLocation(null);
          }}
          onReportTicket={(loc) => {
            setShowPinPopup(false);
            setShowTicketReportModal(true);
            setReportLocation(loc);
            setPinLocation(null);
          }}
          onReportEnforcement={(loc) => {
            setShowPinPopup(false);
            setEnforcementLocation(loc);
            setShowEnforcementConfirm(true);
            setPinLocation(null);
          }}
          onBookmark={(loc) => {
            setShowPinPopup(false);
            openBookmarkNameModal(loc);
          }}
          onStartParking={() => {
            setShowPinPopup(false);
            handleParkingSession();
          }}
          router={router}
        />
      )}

      {/* Ticket Report Modal */}
      <TicketReportModal
        isOpen={showTicketReportModal}
        ticketDateIssued={ticketDateIssued}
        ticketTimeIssued={ticketTimeIssued}
        ticketViolationType={ticketViolationType}
        onClose={handleTicketReportClose}
        onDateChange={setTicketDateIssued}
        onTimeChange={setTicketTimeIssued}
        onViolationChange={setTicketViolationType}
        onSubmit={handleTicketReportSubmit}
        onBookmarkClick={() => openBookmarkNameModal(reportLocation)}
      />
      {/* Enforcement Confirm Modal (centered) */}
      {showEnforcementConfirm && enforcementLocation && (
        <div className={styles.modalOverlay}>
          <div className={styles.ticketReportModalContent}>
            <button
              onClick={() => {
                setShowEnforcementConfirm(false);
                setEnforcementLocation(null);
              }}
              className={styles.closeButton}
            >
              <FaTimes size={22} />
            </button>

            <h2 className={styles.ticketReportTitle}>
              confirm parking enforcement officer sighting?
            </h2>

            <p style={{ textAlign: 'center' }}>
              Would you like to report a parking enforcement officer at the selected location
              (within the past 10 minutes)?
            </p>

            <div className={styles.enforcementButtonGroup}>
              <button
                className={styles.enforcementNoButton}
                onClick={() => {
                  setShowEnforcementConfirm(false);
                  setEnforcementLocation(null);
                }}
              >
                <FaTimes size={16} />
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
                      setShowThankYouModal(true);
                      setSuccessMessage('Enforcement reported successfully!');
                      setShowSuccessToast(true);
                      setTimeout(() => setShowSuccessToast(false), 3000);
                    } else {
                      setErrorMessage(data?.error || 'Failed to report enforcement');
                      setShowErrorToast(true);
                      setTimeout(() => setShowErrorToast(false), 3000);
                    }
                  } catch (err) {
                    console.error('Network error posting enforcement:', err);
                    setErrorMessage('Network error: Failed to report enforcement');
                    setShowErrorToast(true);
                    setTimeout(() => setShowErrorToast(false), 3000);
                  } finally {
                    setEnforcementSubmitting(false);
                  }
                }}
                disabled={enforcementSubmitting}
              >
                <FaCheck size={16} />
                <span>{enforcementSubmitting ? 'submitting...' : 'confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal for Enforcement */}
      <ThankYouModal isOpen={showThankYouModal} onClose={() => setShowThankYouModal(false)} />

      {/* Thank You Modal for Ticket */}
      <ThankYouModal
        isOpen={showTicketThankYouModal}
        onClose={() => setShowTicketThankYouModal(false)}
        title="Thank you for helping our community! 🎉"
        message="Your ticket report will help other drivers stay informed! Look into your city's ticket response options. These options usually include instructions on how to pay and/or dispute your tickets :)"
      />
    </div>
  );
};

export default TicketSpyHeatMap;
