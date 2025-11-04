// deprecated route, TODO: remove in future

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('API route called: /api/report-ticket');

    const body = await request.json();
    console.log('Request body:', body);

    const { latitude, longitude, date, time, username, violationType } = body;

    // Validate required fields
    if (!latitude || !longitude || !date || !time || !violationType) {
      console.error('Validation failed: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('All required fields present');

    // Create Supabase admin client with service role key (bypasses RLS)
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('Created admin Supabase client with service role key');

    // Log the ticket report data
    const ticketData = {
      latitude,
      longitude,
      date,
      time,
      username: username || 'Anonymous', // || user?.email || user?.phone ||
      violationType,
      submittedBy: 'unauthenticated', // user?.id ||
      timestamp: new Date().toISOString(),
    };

    console.log('Ticket Report Received:', ticketData);

    // Save to database - using service role bypasses RLS
    const { data, error } = await supabase.from('tickets').insert({
      latitude,
      longitude,
      ticket_report_date: date,
      ticket_report_hour: time,
      violation_type: violationType,
      user_id: null, // Anonymous submissions
    });

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    console.log('Ticket successfully saved to database:', data);

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket report submitted successfully',
        data: {
          latitude,
          longitude,
          date,
          time,
          violationType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing ticket report:', error);
    return NextResponse.json({ error: 'Failed to submit ticket report' }, { status: 500 });
  }
}

// removed Enable insert for authenticated users only INSERT authenticated
