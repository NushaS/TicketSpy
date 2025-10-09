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
### Dependencies, Installing, Executing program
* Describe any prerequisites, libraries, OS version, etc., needed before installing program.
* ex. Windows 10

* How/where to download your program
* Any modifications needed to be made to files/folders

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```



## Authors
Nusha Sepehri, Abigail McClure, Timofei Kachan, Ahana Roy, Aya Griswold, Leonardo Paredes




## Acknowledgments
* [Living document](https://docs.google.com/document/d/1yHUFKiWZ9WVeeeol_CF2iBfmA2T_carpx6tqQ4-J_iM/edit?usp=sharing)
