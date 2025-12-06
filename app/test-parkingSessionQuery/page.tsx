'use client';

import { useAllParkingSessions } from '@/lib/hooks/useParkingSessionTable';
import React from 'react';

export default function TestParkingSession() {
  const { data, error, isLoading } = useAllParkingSessions();

  if (isLoading) {
    return <p> Loading parking session query... </p>;
  } else if (error) {
    return <p>Error: {error.message}</p>;
  } else {
    const listItems = data?.map((currSessionRow) => (
      <li key={currSessionRow.parking_session_id}>
        User_id: {currSessionRow.user_id} : {currSessionRow.latitude},{currSessionRow.longitude}
        <br></br>
        Date toString: {currSessionRow.parking_session_start_datetime.toString()}
      </li>
    ));

    return <ul>{listItems}</ul>;
  }
}

// neglible change
