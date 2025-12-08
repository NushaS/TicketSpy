# Ticket Spy
🔗 https://ticketspy.vercel.app/

## Description

### Project Idea

TicketSpy seeks to turn real local driver experiences with parking tickets into a community platform for viewing ticketing activity. It is a web application that shows where community members are receiving parking tickets through a visually intuitive heatmap interface. The map will dynamically update with new data as users self-report their ticket information, and filtering capabilities (such as by ticket date or violation type) will allow users to customize their experience in order to mitigate parking risk in their own lives. The self-reported data is a valuable aspect of our project that incentivizes users to upload their ticket information in order to prevent future ticketing for themselves and others.

### Project Goals

Our goal is to deliver a resouce that the local community can engage with in order to minimize the likelihood of being issued a parking ticket. In a city where ticket fine values and ticket issuance frequency are both on the rise, and where poorly marked parking spaces are not uncommon, providing drivers with a resource for avoiding preventable parking tickets is integral to decreasing confusion and ticket fines. This aligns with our ultimate goal of improving local driver confidence and satisfaction.

### Use Case Overview

For detailed use cases and user instructions, visit the [user guide](./user-guide.md).

**1. View heatmap to make informed parking decisions**
  - For users wanting to find a place to park without getting ticketed.
  - Heatmap shows parking ticket density and enforcement sighting alerts
  - The front end for the heat map uses TanStack Query to access the backend and database.

**2. Make reports**
 - Reporting parking ticket
     - For users contributing to the heatmap by reporting their parking ticket.
     - The relevant system components include: The Supabase database, our api route "post-ticket", and the front-end web page to display the ticket coordinates on the heatmap.
  - Reporting enforcement sighting
    - For users contributing to the enforcement alerts on the map by reporting their enfocement sightings.
    - The relevant system components include: The Supabase database, the api route "post-enforcement-report", and the front-end web page to display the enforcement report coordinates on the heatmap.
  
**3. Log in to access additional features**
  - For users looking to personalize their TicketSpy by keeping track of specific locations.
  - Authentication and session management are handled in the backend component, and login credentials/profile data are stored in the database.

### Repository Layout

```
ticketspy/
├── README.md                # High-level README file
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── .env.local                # environment variables
├── .gitignore
│
├── app/
│   ├── layout.tsx            # Root layout (applied to all pages)
│   ├── page.tsx              # Landing page with map visualization
│   ├── api/
│   │   └── post-ticket/
│   │       └── route.ts      # API route for posting tickets
|   ├── auth/                 # Auth/login for supabase
│
├── lib/
│   ├── hooks/        # hooks to get/post to Supabase
│   ├── supabase/     # Supabase client creation to access Supabase
│   └── utils/        # Util such as filtering tickets & map data points
```

## Getting Started

### Running the system

**Prerequisites**

- _Node.js v22.20.0_ (install with [Node.js](https://nodejs.org/en) or through [nvm](https://www.nvmnode.com/))
- _npm v10.9.3_ (run `npm install -g npm@10.9.3`)

**Setup Overview**

For full setup instructions see `How to Build the Software` in the [developer guide](./developer-guide.md).

1. git clone this repository
2. Add a `.env.local` file under the main `TicketSpy` directory for the Supabase credentials. In the file, define:
   - `NEXT_PUBLIC_SUPABASE_URL`=YourSupabaseUrl 
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`=YourSupabaseApiKey
   - `SUPABASE_SERVICE_ROLE_KEY`=YourServiceRoleKey
     
   (Note: This is required, as components that use `/lib/supabase` will throw errors if the credentials are not available.)

   To access our Supabase credentials:
   - if you are a UW student, access them [here](https://docs.google.com/document/d/1XV_wcLVr5xJQiNSPcsQuTWJQUjbESwpbuEIlXwFTbkE/edit?usp=sharing).
   - if you are not a UW student, please email us (emails available via the living document in `Acknowledgements`).
     
4. Run `npm install`
5. Run `npm run dev`
6. Navigate to `http://localhost:3000` to see it in action!


## Bugs & Issues

To track current or past issues, view our [issue tracker](https://github.com/NushaS/TicketSpy/issues).

To report a new bug, see `How to Report a Bug` in the [user guide](./user-guide.md).

## Privacy Note & Data Disclaimer

TicketSpy does not expose sensitive or private information. Parking enforcement vehicles are deliberately marked and highly visible to the public by nature. The app simply allows users to share information that is already observable in public spaces.

TicketSpy does not track individual users nor does it does not provide tools for evading law enforcement. Reports are crowdsourced from voluntary user submissions, such that inaccurate or incomplete data is a potential risk. Always follow local parking laws; TicketSpy does not take responsibility for users' individual decisions.

For users concerned about personal privacy:
- Location sharing is opt-in.
- TicketSpy accounts can be deleted at any time. 
- All user-generated data is associated only to with the corresponding user ID in Supabase, and is removed if you delete your account (via `CASCADE ON DELETE`).

## Testing Overview

For full build and test details, visit the [developer guide](./developer-guide.md).

### Husky pre-commit hooks

Husky has been added to execute pre-push testing locally.

git hooks triggers the file `.husky/pre-commit` to run, which verifies that the following commands pass:

- `npm test`
- `npm run lint`
- `npm run build`

All 3 must pass before changes can be committed. 

### jest

`jest.config.js` - configures jest integration with Next.js

`jest.setup.js`- runs once before all tests to load global utilities

## Authors

Nusha Sepehri  
Abigail McClure  
Timofei Kachan  
Ahana Roy  
Aya Griswold  
Leonardo Paredes

## Acknowledgments

[Living document](https://docs.google.com/document/d/1yHUFKiWZ9WVeeeol_CF2iBfmA2T_carpx6tqQ4-J_iM/edit?usp=sharing)
