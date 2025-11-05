# Ticket Spy

## Description

### Project Idea

TicketSpy seeks to turn real local driver experiences with parking tickets into a community platform for viewing ticketing activity. It is a web application that shows where community members are receiving parking tickets through a visually intuitive heatmap interface. The map will dynamically update with new data as users self-report their ticket information, and filtering capabilities (such as by ticket date or violation type) will allow users to customize their experience in order to mitigate parking risk in their own lives. The self-reported data is a valuable aspect of our project that incentivizes users to upload their ticket information in order to prevent future ticketing for themselves and others.

### Project Goals

Our goal is to deliver a resouce that the local community can engage with in order to minimize the likelihood of being issued a parking ticket. In a city where ticket fine values and ticket issuance frequency are both on the rise, and where poorly marked parking spaces are not uncommon, providing drivers with a resource for avoiding preventable parking tickets is integral to decreasing confusion and ticket fines. This aligns with our ultimate goal of improving local driver confidence and satisfaction.

### Repository Layout

```
ticketspy/
├── README.md
├── package.json
├── tsconfig.json / jsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── .env.local
├── .gitignore
│
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (applied to all pages)
│   │   ├── page.tsx              # Landing page with map visualization
│   │   ├── report/
│   │   │   └── page.tsx          # Form page for self-reporting tickets
│   │   ├── api/
│   │   │   └── tickets/
│   │   │       └── route.ts      # API route for fetching/adding tickets
│   │   └── _components/
│   │       ├── MapView.tsx       # Interactive map & heatmap
│   │       ├── TicketForm.tsx    # User input form
│   │       ├── Navbar.tsx        # Navigation bar
│   │       └── Footer.tsx        # Footer component
│   │
│   ├── lib/
│   │   ├── supabaseClient.ts     # Supabase client configuration
│   │   ├── fetchTickets.ts       # Data fetching with TanStack Query
│   │   └── mapUtils.ts           # Map data processing helpers
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind global styles
│   │
│   └── types/
│       └── ticket.ts             # TypeScript interfaces
│
└── vercel.json                   # (Optional) Deployment configuration


```

## Getting Started

### Running the system

DEPENDENCIES
1. Install node.js v22.20.0 in google
2. npm install -g npm@10.9.3

git clone our repo

1. (optional) Add a .env.local file under TicketSpy/ticketspy for the Supabase credentials  
   **_.env.local_**  
   NEXT_PUBLIC_SUPABASE_URL=YourSupabaseUrl  
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=YourSupabaseApiKey
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
