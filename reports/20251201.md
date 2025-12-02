# **Team Report (Dec 1, 2025\)**

### **Project meeting agenda**

1. Sharing progress & issues and plans & goals sections from status report  
2. Request and review any current project feedback  
3. Miscellaneous Q\&A time (upcoming deadlines (final release, presentation, reflection), sticking points, procedural questions, etc.)

# **Team Goals**

### **1\. Last week's goals**

- Record and submit gamma release presentation\! (1 day)  
- Implement log out functionality (2 days)  
- Finish implementing account detail functionalities (updating name and email, deleting account) (3 days)  
- Style pin logic popups (1 day)  
- Get notifications fully working for ALL users (2 days)  
- Reroute log in button on pop up to the actual log in page (1 day)  
- Add a thank you/a link to official directions on how to protest a ticket when a user reports a parking ticket (2 days)  
- Finish ticket\_type enum (1 day)

### **2\. Progress and issues** 

What we did and learned:

- Started cleaning up UI and making finishing touches on the latest added features  
- Recorded gamma presentation \+ ensured that it included our latest updates and additions  
- Email notifications now has verified domain to send to more than just 1 email  
- Email notifications now based on mile-distance-slider in profile-settings page  
- Email notifications now only sent for ticket reports in the past 24 hours  
- Profile page log-out and delete functionality as well as editable email & display name fields

Challenges/things that we had trouble with include:

- Email rate-limiting error, max 2 per second  
- Had to refactor & fix account details (i.e. file renaming, use existing hook, email update fix)

**3\. Plans and goals for the next week** 

- Finalize frontend and ensure that everything is functional and uniform (2 days)  
- Check and test that database is properly updated with the reporting of tickets and enforcement sightings (2 days)  
- Fix up email rate-limiting error (1 day)  
- Finalize site-wide UI style changes for consistency (2 days)  
- Finish updating pin logic & popups (1-2 days)

# **Individual Contributions/Goals**

### **1\. Last week's goals**

1. Nusha:  
- Clean up the  parking enforcement reporting popup to make it match the rest of the site (1 day)  
- Create Thank you message for reporting your ticket and/or provide information on how to appeal your parking ticket (2 days)  
- Long-term goal: create bookmark interface

2. Abigail:  
- Reroute “log in” button on popup to route to actual log in page (1 day)  
- Set up higher rate limiting and ensure emails can be sent to more people for notifications (2 days)  
- Help with backend for profile page, like log out and delete account (2 days)  
3. Timofei:  
- Adding functionality to profile page to allow user to toggle notifications for parking and for bookmarks on and off (1 day)  
- Make report parking enforcement also send notifications (1 day)  
- Work with Abigail to upgrade account for sending emails to a production account so we can have higher sending rates (2 days)  
4. Ahana:  
- See what backend needs help with and work accordingly (to be discussed at 11/25 team meeting) (1 day)  
- lib/server make sure that that users are only notified when the ticket’s been reported in the past day (1 day)  
- Diagnose point is showing up incorrectly when reporting too dark instead of light, check frontend and database (1 day)  
  - page.tsx  
  - heatmapConfig.ts  
5. Aya:  
- Finish account detail functionality on the profile settings page (3 days)  
  - Apply styling to be consistent with the rest of the page  
  - Add the link to the password update field   
  - Implement log out and delete account buttons  
- Update styling for the bookmark pin and parking session edit and delete pin popups (1-2 day)  
-   
6. Leo:  
- Finish up ticket\_type\_enum as before but this time only for parking tickets (2 days)  
- Verify branches are cleaned up and deleted (1 day)  
  - Create a DB schema (3 days)  
- Set up at least 1 unit test for parking sessions (2 days)

**2\. Progress and issues**

1. Nusha:  
- Experimented with parking enforcement reporting popup sizing to make it match the rest of the site  
- Did research on information about how to address parking tickets and narrowed down credible sources to include in the Thank You for Reporting popup message  
- Worked on shrinking the header bar at the top of the page  
- Make opacity slider go away  
  - Having trouble with it only remaining when using filters and no other popup  
2. Abigail:   
- Made a lot of small UI changes  
- Created api route for updating notification settings  
- Implemented displaying notification settings and connected UI to backend, so notifications successfully toggle now  
- Rerouted log in/create account buttons on pop up to go to correct pages  
- Looked into rate limiting  
- Added slogan to header  
- No challenges and not stuck currently  
3. Timofei:  
- Made the profile page updating use safer database requests. Uses session to validate that the user updating profile is the correct user, can’t edit other users data. Updated RLS policies on user table to authenticate user.  
- Added names to bookmarks  
- Made alert email sent to users include a list of users bookmarks that were in the area and a link to see the alert (takes user to the location on the map)  
- Made multiple bookmarks work  
- A good amount of panning went into how emails are going to look and how the user will be notified about the alert and if bookmarks should have names   
4. Ahana:  
- Set email notifications for users only when tickets have been reported in the past 24 hours  
- Started looking through frontend for any visual issues with reporting tickets   
5. Aya:  
- Finished profile account details section of the profile settings page  
  - Added editable name/email fields to the section  
  - Implemented log out and delete account functionality  
- Currently working on the bookmark/parking session modification logic  
  - Updating the pin logic to match the figma prototype (parking at bookmarked spots, “ending” parking sessions, bookmarking parking spots when ending parking sessions)  
  - Integrating the existing delete pin code into the updated logic  
  - Applying styling to the three relevant modals  
- Challenges:  
  - Had to debug/improve several details in the account details work after its initial release (refactoring the code to use an existing hook, renaming files to improve clarity, fixing user table email field update issue)  
  - Battled some syncing issues with my IDE  
  - Not getting sidetracked by small bugs and inconsistencies (had to think about which fixes were and were not directly related to the task at hand)  
6. Leo:  
- Obtained [ticketspy.org](http://ticketspy.org) domain on NameCheap  
  - Configured advanced-dns of DKIM & SPF in NameCheap  
  - Verified Domain in Resend (email website)  
- Implemented mile-distance-slider on profile-settings page  
  - Changes notification distance for both ticket-notifications and enforcement-notifications  
  - Added notification\_distance\_miles supabase column  
- ISSUES:  
  - Rate limiting error for some developers but not for all. It seems capped at 2 emails per second but I am currently unaware of how to replicate this

**3\. Plans and goals for the next week** 

measurable \+ time estimate

1. Nusha:  
- Finalize and draft pull request for Thank You message and information that pops up for user after reporting a parking ticket (2 days)  
- Go over the overall frontend to ensure that everything is functional and check with Aya that the UI is consistent and adheres to original Figma (2 days)  
- Test the enforcement sighting popups to make sure it stays on the map for exactly an hour (2 days)  
2. Abigail:   
- Finish UI fixes  
- Fix website for mobile  
- Last changes to notification emails, work with Timofei to add names of bookmarks to emails  
- Add Xs to log in and sign in pages   
- Add functionality that uses user’s IP address to open map to an approximate area, maybe ask Ahana to do this  
3. Timofei:  
- Fix rate limiting for emails by adding a queue and timed requests (1 day)  
- Help abigail fix the front end issues (1 day)  
- Do more hands on testing and make sure there are no flaws in logic, and fix those flaws as they arise (3 days)  
- Make the map open at users location using their IP address (1 day)  
4. Ahana:  
- Finish checking if frontend UI has any issues with how data is reported on the map (heapmap density) (1 day)  
- Continue seeing what backend needs help with (1 day)  
5. Aya:  
- Finish implementing the updated pin logic and styling the corresponding popups (1-2 days)  
- Sitewide UI style updates for consistency (2 days) \- colors, font size/spacing/style, button icons, and other little things  
- Present my small list of bugs at the next meeting → determine which ones to address myself, which ones to delegate, and which are not significant (2-3 days for development)  
6. Leo:  
- Add unit OR integration tests for email-notifications and mile slider (3 days)  
- Fix “rate limiting” issue with Abigail about email-notifications (1 day)  
- Fix last github issue (about tests) while at it (1 day)

