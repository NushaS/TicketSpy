# Developer guide

## Source code

To obtain the source code, the developer needs to clone the repository locally. There is only one repository for TicketSpy. To make changes, create a new branch, and then create a pull request to the dev branch. Then, once approved, created another pull request to the main branch.

## Layout explained

'''
ticketspy/
├── app/
│ ├── auth/ # next.js auto built the auth. Auth for login
│ ├── protected/  
│ ├── instruments/
│ ├── test-query/
│ └── welcome/ # include **tests**
├── components/ # reusable components
│ ├── tutorial/
│ └── ui/
├── lib/ # Supabase client & hooks
│ ├── hooks/
│ └── supabase/
├── reports/ # Our weekly tuesday reports
├── README.md # README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── tailwind.config.ts
└── postcss.config.mjs
'''
Source files: app, components/, lib/, and config files such as tsconfig.ts, tailwindconfig.ts, etc
The app source file contains all our pages, the components contains all our react components we made or were auto-made by Next.js template. The lib contains our Supabase logic and hooks. The rest of the files are just our config files.

Tests: For now, we only have app/welcome/_tests_/ for the single test
Documentation: contains the README.md for our project. Also contains our weekly reports. Also contains our user-guide.md and developer-guide.md just like the README.md
Data files: N/A

## How to Build the Software

Follow these steps to build and run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/TicketSpy.git
   cd TicketSpy
   ```
2. **Create a new branch (optional)**
   ```bash
   git checkout -b <branch-name>
   ```
3. **Set up environment variables**
   Create a file named `.env.local` in the project root.  
   Add your Supabase credentials and project-specific configuration values, for example:
   ```bash
    NEXT_PUBLIC_SUPABASE_URL=https://zknbtqijbtbkonysrtjr.supabase.co
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbmJ0cWlqYnRia29ueXNydGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDI4MTYsImV4cCI6MjA3NTYxODgxNn0.LjEZQWSYmqsWKptDFaG2WyETQzfld0APEeHdlrI5Tco
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Run the development server**
   ```bash
   npm run dev
   ```
6. **View the application**
   Once the build completes successfully, open the URL displayed in your terminal (usually [http://localhost:3000](http://localhost:3000)) to view the website.

## How to Test the Software

Follow these steps to run and verify the system’s test cases:

1. **Automated test execution**
   - Tests are automatically executed whenever you:
     - Push new code to the repository
     - Create or update a pull request
     - Make a new commit
   - The automated workflow will:
     - Build the project
     - Run all test suites
     - Run the linter (`eslint`)
     - Install all necessary dependencies

2. **Run the linter manually**
   If you want to check for linting or formatting issues before committing:

   ```bash
   npm run lint
   ```

3. **Check for compile-time issues**
   When running the development server, any build or compile errors will be displayed automatically:
   ```bash
   npm run dev
   ```

## How to Add New Tests

Are there any naming conventions/patterns to follow when naming test files? Is there a particular test harness to use?

### Adding New Tests

Our script `npm run test` (configured in `package.json`) will run **Jest**.  
Jest will search under the `_tests_` folder by default, as well as any file that matches `*.test.js`, `*.test.ts`, or `*.test.tsx` formats.

To add a new test:

1. Navigate to the page or component that you want to test.
2. Create a `__tests__` folder inside the same directory.
3. Add a file named `yourFileName.test.tsx` inside that folder.

For example, see the `app/welcome/_tests_` folder.

### Naming Conventions/Patterns

- Test file names should reflect the file or component being tested:

  ```
  componentName.test.tsx
  ```

  **Example:** If the component is `page.tsx`, name the test `page.test.tsx`.

- Test descriptions inside the test file should communicate expected behavior.

- Tests should follow a behavior-driven structure:
  - **Arrange:** Set up the component / mocks
  - **Act:** Perform the interaction
  - **Assert:** Verify the expected result

- Keep each test focused on one behavior.

---

## How to Build a Release of the Software

Describe any tasks that are not automated. For example, should a developer update a version number (in code and documentation) prior to invoking the build system? Are there any sanity checks a developer should perform after building a release?

### Update the Version Number

We follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`), for example: `1.2.0`.

Before building a release:

1. Update the version in `package.json`.
2. If the version number appears in documentation (e.g., `README` or `CHANGELOG`), update it there as well.

### Update the Changelog (if applicable)

Create or update a `CHANGELOG.md` entry summarizing:

- New features
- Bug fixes
- Breaking changes (if any)

### Build the Application

```bash
npm install
npm run build
```

### Run Sanity Checks

Before releasing, verify that the build works as expected.
