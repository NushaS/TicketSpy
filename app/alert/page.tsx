'use client';
// Alert deep-link page: accepts ?id=... for a ticket or enforcement and centers the main map on it.

import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState, Suspense } from 'react';
import { useTicketTable } from '@/lib/hooks/useTicketTable';
import { useEnforcementSightingTable } from '@/lib/hooks/useEnforcementSightingTable';
import { AlertParkingEnforcementIcon } from '@/components/ui/icons/alert-parking-enforcement';
import { AlertTicketIcon } from '@/components/ui/icons/alert-ticket-icon';
import TicketSpyHeatMap from '../TicketSpyHeatMap';

type LocationHit = {
  lat: number;
  lng: number;
  source: 'ticket' | 'enforcement';
  observedAt?: string | null;
};

export default function AlertPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16, color: '#555' }}>Loading alert…</div>}>
      <AlertPageInner />
    </Suspense>
  );
}

function AlertPageInner() {
  const params = useSearchParams();
  const id = params.get('id')?.trim(); // incoming id from query string
  const [lockedLocation, setLockedLocation] = useState<LocationHit | null>(null);
  const {
    data: tickets = [],
    isLoading: ticketsLoading,
    isFetching: ticketsFetching,
  } = useTicketTable();
  const {
    data: enforcementSightings = [],
    isLoading: enforcementLoading,
    isFetching: enforcementFetching,
  } = useEnforcementSightingTable();

  const location: LocationHit | null = useMemo(() => {
    if (!id) return null;

    // Try tickets first
    const ticket = (tickets as any[]).find(
      (t) => t?.ticket_id === id || t?.id === id || t?.ticketID === id
    );
    if (
      ticket &&
      typeof ticket.latitude === 'number' &&
      typeof ticket.longitude === 'number' &&
      Number.isFinite(ticket.latitude) &&
      Number.isFinite(ticket.longitude)
    ) {
      return {
        lat: ticket.latitude,
        lng: ticket.longitude,
        source: 'ticket',
        observedAt: ticket.ticket_report_date ?? null,
      };
    }

    // Fall back to enforcement sightings
    const enforcement = (enforcementSightings as any[]).find(
      (e) => e?.enforcement_id === id || e?.id === id
    );
    if (
      enforcement &&
      typeof enforcement.latitude === 'number' &&
      typeof enforcement.longitude === 'number' &&
      Number.isFinite(enforcement.latitude) &&
      Number.isFinite(enforcement.longitude)
    ) {
      return {
        lat: enforcement.latitude,
        lng: enforcement.longitude,
        source: 'enforcement',
        observedAt: enforcement.enforcement_report_time ?? enforcement.sighting_time ?? null,
      };
    }

    return null;
  }, [id, tickets, enforcementSightings]);

  const isBusy = ticketsLoading || ticketsFetching || enforcementLoading || enforcementFetching;
  const effectiveError = null;

  // Capture the found location and swap the URL once
  useEffect(() => {
    if (!location || lockedLocation) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLockedLocation(location);
    requestAnimationFrame(() => {
      try {
        window.history.replaceState(null, '', '/');
      } catch {
        // ignore
      }
    });
  }, [location, lockedLocation]);

  const markerLocation = lockedLocation ?? location ?? null;
  const shouldShowNotFound = !isBusy && !markerLocation;

  return (
    <>
      {effectiveError && (
        <div style={{ padding: 16, color: 'crimson' }}>{effectiveError ?? 'Invalid request'}</div>
      )}
      {isBusy && !location && (
        <div style={{ padding: 16, color: '#555' }}>Loading location for alert…</div>
      )}
      {shouldShowNotFound && !effectiveError && (
        <div style={{ padding: 16, color: '#555' }}>
          No ticket or enforcement sighting alert found
        </div>
      )}
      {/* Reuse the main map component, passing the resolved center + marker details */}
      <TicketSpyHeatMap
        initialCenter={markerLocation ? { lat: markerLocation.lat, lng: markerLocation.lng } : null}
        alertMarker={
          markerLocation
            ? {
                lat: markerLocation.lat,
                lng: markerLocation.lng,
                label:
                  markerLocation.source === 'enforcement'
                    ? `Parking enforcement spotted ${
                        markerLocation.observedAt
                          ? `at ${new Date(markerLocation.observedAt).toLocaleString()}`
                          : ''
                      }`
                    : `Ticket ${
                        markerLocation.observedAt
                          ? `reported at ${new Date(markerLocation.observedAt).toLocaleString()}`
                          : ''
                      }`,
                kind: markerLocation.source,
                icon:
                  markerLocation.source === 'enforcement' ? (
                    <AlertParkingEnforcementIcon size={36} />
                  ) : (
                    <AlertTicketIcon size={36} />
                  ),
              }
            : null
        }
      />
    </>
  );
}
