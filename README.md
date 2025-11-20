# Ticket Spy
🔗 https://ticketspy.vercel.app/
## Description

### Project Idea

TicketSpy seeks to turn real local driver experiences with parking tickets into a community platform for viewing ticketing activity. It is a web application that shows where community members are receiving parking tickets through a visually intuitive heatmap interface. The map will dynamically update with new data as users self-report their ticket information, and filtering capabilities (such as by ticket date or violation type) will allow users to customize their experience in order to mitigate parking risk in their own lives. The self-reported data is a valuable aspect of our project that incentivizes users to upload their ticket information in order to prevent future ticketing for themselves and others.

### Project Goals

Our goal is to deliver a resouce that the local community can engage with in order to minimize the likelihood of being issued a parking ticket. In a city where ticket fine values and ticket issuance frequency are both on the rise, and where poorly marked parking spaces are not uncommon, providing drivers with a resource for avoiding preventable parking tickets is integral to decreasing confusion and ticket fines. This aligns with our ultimate goal of improving local driver confidence and satisfaction.

### Currently Supported (or Partially Supported) Use Cases

**1. Looking at heatmap to make informed parking decisions (Operational)**
  - For users wanting to find a place to park without getting ticketed
  - Currently, the heat map is displaying areas with tickets, so a user could look at the map to figure out a place with no/few recent parking tickets. It is defaulted to tickets within the past year right now.
  - The front end for the heat map uses TanStack Query to access the backend and database.

**2. Making reports (Partially-operational)**
 - Reporting parking ticket
     - For users trying to report their parking ticket for others to see
     - Users are able to report a ticket on a location they click. When they do so, they are able to report the ticket time, date, and ticket type. Currently, they are only able to report a "default parking ticket" enum, but we will add more choices for parking tickets in the future
     - The system components that are used include: The Supabase database, our api route "post-ticket", and the front-end web page to display the ticket coordinates on the heatmap
  - Reporting enforcement sighting
    - For users trying to report if they've recently seen parking enforcement.
    - Reporting button is available next to the button for reporting a parking ticket, but is non-operational as of now.
    - The system components that are used will include: The Supabase database, the api route "post-enforcement-report", and the front-end web page to display the enforcement report coordinates on the heatmap.
  
**3. Logging in to access additional features (Operational)**
  - For users looking to personalize their TicketSpy by keeping track of specific locations.
  - Currently, users can create an account and log in successfully with that account, which will give them access to bookmark and parking session pins and text notifications once those features become available. 
  - The login and create account user interface handle user input and invoke requests from the frontend, user authentication and session management is handled in the backend component, and login credentials/profile data are stored in the database.


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

DEPENDENCIES
1. Install node.js v22.20.0 (either via Node.js in Google OR through nvm)
2. npm install -g npm@10.9.3

git clone our repo

1. (optional if you don't want to see existing data) Add a .env.local file under TicketSpy/ticketspy for the Supabase credentials  
   **_.env.local_**  
   NEXT_PUBLIC_SUPABASE_URL=YourSupabaseUrl  
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=YourSupabaseApiKey
   SUPABASE_SERVICE_ROLE_KEY=YourServiceRoleKey
   If you are a UW student, you can access our API keys here!
   https://docs.google.com/document/d/1XV_wcLVr5xJQiNSPcsQuTWJQUjbESwpbuEIlXwFTbkE/edit?usp=sharing
3. npm install
4. npm run dev
5. Head to `http://localhost:3000` to see it in action!

To see how to build & test the system, follow our 'Developer Guide' <br>
To see our version control, follow our 'Developer Guide' as well
- [Developer Guide](./developer-guide.md)

To track our current bugs or report a new one, follow our 'User Guide'
- [User Guide](./user-guide.md)


## Authors

Nusha Sepehri  
Abigail McClure  
Timofei Kachan  
Ahana Roy  
Aya Griswold  
Leonardo Paredes

## Acknowledgments

- [Living document](https://docs.google.com/document/d/1yHUFKiWZ9WVeeeol_CF2iBfmA2T_carpx6tqQ4-J_iM/edit?usp=sharing)

## Testing

added husky to do pre-push testing locally

### Husky for pre-commit testing

`.husky/pre-commit`
git hooks triggers this file to run which ensures the following commands pass:

npm test
npm run lint
npm run build

These need to pass before you are allowed to commit your changes

### jest

`jest.config.js`
configures jest integration with Next.js

`jest.setup.js`
Runs once before all tests to load global utilities

`app/welcome/__tests__/page.test.tsx`
Test file while makes sure welcome page loads (can be used as example to make more tests)
