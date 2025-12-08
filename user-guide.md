# User Guide

## Description

TicketSpy helps drivers make informed parking decisions and avoid tickets and fines while keeping track of their favorite parking spots. Through a visually intuitive heatmap and user-reported parking ticket issuance and enforcement sighting data, TicketSpy allows drivers to:

- Avoid risky parking locations by quickly identifying high-ticket areas and parking enforcement sightings in their vicinity.
- Refine parking insights using advanced filters such as ticket recency, time of day, or day of the week, to obtain the most relevant parking ticket information to their needs.
- Bookmark their favorite parking locations or mark active parking sessions on the map for easy access.
- Receive real-time alerts when tickets or parking enforcement sightings are reported near parked or bookmarked locations, allowing proactive action to avoid fines.
- Submit their own reports of parking tickets or parking enforcement sightings in order to help the local driver community stay informed.

## Accessing TicketSpy

TicketSpy is a web-hosted application and has no prerequisites or necessary installations. 

Users can visit TicketSpy at https://ticketspy.vercel.app/.

For those who are interested in running the application locally, please see the [developer guide ](https://github.com/NushaS/TicketSpy/blob/main/developer-guide.md)for setup instructions.

## Using TicketSpy

Note that while TicketSpy is available to anyone with web browser access, some app features are only available to users who are signed in with an active TicketSpy account.

### Public Users

**All TicketSpy users, regardless of whether they are signed in, can:**

- View the heatmap of parking ticket density:
  - Zoom in and out of the map interface as needed.
  - Adjust the heatmap gradient opacity using the slider in the upper left corner as needed.
  
- View parking enforcement sighting alerts:
  - Locate the "exclamation point" enfocement sighting alerts on the map.
  - Click on alerts to view their sighting date and time details.
  - Enfocement alerts are visible on the map for one hour.


- Apply filters to the heatmap:
  1. Click on the `filters` button in the upper right corner of the heatmap.
  2. Select the desired filter values.
  3. Click “apply filters” to view the filtered heatmap.

- Report a parking ticket (_visual example available below_):
  1. Click the parking ticket issuance location on the heatmap.
  2. Select `report a ticket` on the from the pop-up options.
  3. Fill out the date, time, and violation type information for the parking ticket in the `Report a ticket` pop-up form.
  4. Click `submit ticket report` to complete the report.

- Report a parking enforcement officer sighting:
  1. Click the location at which the parking enforcement officer was sighted on the heatmap.
  2. Select `report parking enforcement nearby` from the pop-up options.
  3. Click `confirm` to complete the report.

- Create account and sign in to access additional features:
  1. Click `create account` in the upper right corner of the screen.
  2. Fill out the name and email information, and create a password for the new TicketSpy account.
  3. Click `submit` to create the account.
  4. Click `sign in` in the upper right corner of the screen.
  5. Enter the email and password associated with the account.
  6. Click `submit` to sign in to the account.

### Signed-in Users

**In addition to the features above, TicketSpy users who are signed in can:**

- Bookmark parking spots for future reference:
  1. Click the bookmark location on the heatmap.
  2. Select “bookmark this spot” from the pop-up options. 
  3. Fill out the `bookmark name` field to assign a name to the bookmark, and click `save bookmark` to place a heart pin on the map. 
  4. To remove the bookmark, click the heart pin on the map and select `delete bookmark`.
  

- Mark their current parking spot:
  - To park at an existing bookmark location:
    1. Click on the heart pin at the bookmarked location.
    2. Select `just parked here` to place the parking pin at the location.

  - To park at a new location:
    1. Click the parking location on the heatmap.
    2. Select `just parked here` on the place the parking pin at the location.

  - To end the parking session:
    1. Click on the parking pin.
    2. Click `end parking` to remove the parking pin. If the location was previously bookmarked, ending the parking session will automatically restore the heart pin; otherwise, optionally choose to place a new bookmark (`yes`) or end the session without bookmarking (`no`). 
    
  - Note that only one parking session can be active at a time per user; if a new parking session is created while one already exists, the first parking session will be ended automatically. 

- Enable/disable email alert notifications for parking enforcement sightings and ticket reports:
  1. Click on the user icon in the upper right corner of the screen.
  2. Navigate to the top half of the screen (the `notification settings` section).
  3. Enable or disable each setting using the corresponding toggle.
  4. Set the preferred notification mile radius using the `notification radius` slider. 

- Navigate to enforcement sighting or ticket report locations on the map from email notifications:
  1. Upon receiving an email notification, click the ticket report or enforcement sighting link in the email.
  2. View the corresponding enforcement sighting alert or ticket report point on the map.

- Manage their account information:
  1. Click on the user icon in the upper right corner of the screen.
  2. Navigate to the bottom half of the screen (the `account details` section).
  - Log out or delete the account via the corresponding buttons, or
  - Update account information:
    1. Begin typing in either of the account information fields (name, email) to make any changes.
    2. Click `save changes` to updated the account information, or `discard changes` to ignore any changes.
    3. Optionally update password using the `forgot your password?` link.

### Example Ticket Report
 Click the parking ticket issuance location on the heatmap.
  2. Select `report a ticket` on the from the pop-up options.
  3. Fill out the date, time, and violation type information for the parking ticket in the `Report a ticket` pop-up form.
  4. Click `submit ticket report` to complete the report.

1.  Click the parking ticket issuance location on the heatmap.<br>
Select `report a ticket`.<br>  
<img width="200" height="300" alt="ticket-report-1" src="https://github.com/user-attachments/assets/e1f179fe-8d2c-46a9-afd8-360208432c15" />

2. Fill out the date, time, and violation type form fields for the ticket.<br>
Click "Submit ticket report"<br>  
<img width="200" height="300" alt="ticket-report-2" src="https://github.com/user-attachments/assets/42df0ab6-3772-4312-80b7-44b6d8cfddbc" />

3. View your new report on the map! <br>  
<img width="200" height="300" alt="ticket-report-3" src="https://github.com/user-attachments/assets/79f604f1-299d-471e-81b1-a864f1547674" />

## How to Report a Bug

If you encounter a bug, please report it using [our issue tracker](https://github.com/NushaS/TicketSpy/issues).

When submitting a bug report, please include enough detail for us to reproduce and understand the issue. 

Your bug report should include:

- **Title**: a short summary of the issue.
- **Description**: the experienced behavior vs the expected behavior.
- **Steps to reproduce**: a list of the sequence of steps leading up to the bug, if known.
- **Environment**: the browser/device that was being used.
- **Screenshots**: any screenshots that have been captured of the issue.
- **Additional comments**: any additional useful context. 

## Known Bugs
- Currently, there is no character limit for usernames. Because usernames are shown in the upper right header, we ask that usernames do not exceed 40 characters in length in order to maintain the visual integrity of the map header until this bug is resolved.
