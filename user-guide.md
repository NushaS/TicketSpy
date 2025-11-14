# User Guide

## Description

TicketSpy helps drivers make informed parking decisions and avoid parking tickets and fines while keeping track of their favorite parking spots. Through user-reported parking ticket and enforcement data and a visually intuitive heatmap, TicketSpy allows drivers to:

- Avoid risky parking locations by quickly identifying high-ticket areas in their vicinity.
- Refine parking insights using advanced filters such as ticket recency, time of day, and violation type, for the parking ticket information most relevant to their needs.
- Mark current parking spots and bookmark their favorite parking locations on the map for easy access.
- Receive real-time alerts when parking enforcement is reported near parked or bookmarked locations, allowing proactive action to avoid fines.
- Submit reports of parking tickets or parking enforcement sightings in order to help the local driver community stay informed.

## Accessing TicketSpy

TicketSpy is a web-hosted application and has no prerequisites or necessary installations.  

Users can visit TicketSpy at https://ticketspy.vercel.app/.

## Using TicketSpy

While TicketSpy is available to anyone with web browser access, some app features are only available to users who have signed in with an active TicketSpy account.

### Public Users

All TicketSpy users, regardless of whether they are signed in, can:

- View the heatmap of parking ticket density.
  - Zoom in and out of the map interface as needed
  - (Work in progress: View the heatmap color legend to interpret the visualization numerically)

- Apply filter options to the heatmap
  1. Click on the three-line “Filters” icon on the upper right corner of the heatmap.
  2. Select the desired filter options.
  3. Click “apply filters” to view the filtered heatmap.

- Report a parking ticket
  1. Click the parking ticket issuance location on the heatmap
  2. Select “report a ticket” on the pop-up screen.
  3. Fill out the date, time, and violation type information for the parking ticket in the “Report a ticket” pop-up form.
  4. Click “Submit ticket report” to complete the report.

- Report a parking enforcement officer sighting
  1. Click the location at which the parking enforcement officer was sighted on the heatmap.
  2. Select “report parking enforcement nearby” on the pop-up screen.
  3. Click “yes!” to confirm enforcement officer sighting and complete the report.

- Create account and sign in to access additional features
  1. Click “create account” in the upper right corner of the screen.
  2. Fill out the name and phone number information, as well as a password for the new TicketSpy account.
  3. Click “create” to create the account.
  4. Click “sign in” in the upper right corner of the screen.
  5. Enter the name and password associated with the account.
  6. Click “submit” to sign in to the account.

### Signed-in Users

In addition to the features above, TicketSpy users who are signed in can:

- Bookmark parking spots for future reference
  1. Click the bookmark location on the heatmap.
  2. Select “bookmark this spot” on the pop-up screen to place the heart icon at the location.
  3. To remove the bookmark, click on the heart icon on the map and select “delete bookmark” on the pop-up screen.

- Mark their current parking spot
  - To park at an existing bookmark location:
    1. Click the heart icon at the bookmarked location.
    2. Select “just parked here” to place the parking icon at the location.

  - To park at an unmarked location:
    1. Click the parking location on the heatmap.
    2. Select “just parked here” on the pop-up screen to place the parking icon at the location.
    3. To end the parking session and remove the parking icon, click on the parking icon on the map and click “end parking” on the pop-up screen.
    4. To bookmark the location for future use, select “yes” on the pop-up screen; otherwise, select “no”.

- Enable/disable notifications for parking enforcement sightings
  1. Click on the user icon with their name in the upper right corner of the screen.
  2. Navigate to the top half of the screen (under “notification settings”).
  3. Enable or disable each setting via the corresponding toggle.

- Manage their account information
  1. Click on the user icon with their name in the upper right corner of the screen.
  2. Navigate to the bottom half of the screen (under “my account”).
  - Log out or delete the account via the corresponding buttons, or
  - Update account information:
    1. Begin typing in any of the account information fields (name, phone number, or password) to make changes.
    2. Click “save changes” to save changes made to account information, or “discard changes” to ignore changes.

## How to Report a Bug

If you encounter a bug, please report it using our issue tracker here: https://github.com/NushaS/TicketSpy/issues

When submitting a bug report, please include enough detail for us to reproduce and understand the issue.

Your bug report should include:

- Title: a short summary of the issue
- Description: the behavior you are experiencing and the behavior you were expecting
- Steps to reproduce: List the exact steps to trigger the bug
- Environment: browser/device that you are using
- Screenshots: Attach anything that shows the issue
- Additional comments: Anything else that would be helpful for us to know

## Known Bugs

- As of right now, there are no known bugs.
