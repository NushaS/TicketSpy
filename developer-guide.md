# Developer guide

## Source code

To obtain the source code, the developer needs to clone the repository locally. There is only one repository for TicketSpy. To make changes, create a new branch, and then create a pull request to the dev branch. Then, once approved, created another pull request to the main branch.

## Layout explained
```
ticketspy/
├── app
│   ├── api          
│   ├── auth         # built-in Supabase log in functionality
│   ├── components   # modularization
│   ├── lib
│   │   ├── enums   # Supabase enums
│   │   ├── hooks   # All Supabase table hooks
│   │   ├── server  # Mostly send-email server functionality
│   │   ├── supabase
│   │   └── utils
│   ├── page.tsx
│   ├── profile-settings
│   │   └── page.tsx
│ 
├── app/__tests__
│   ├── api   # test app/api/
│   └── unit  # common unit tests
└── .env.local
```
Source files: app, components/, lib/, and config files such as tsconfig.ts, tailwindconfig.ts, etc
The app source file contains all our pages, the components contains all our react components we made or were auto-made by Next.js template. The lib contains our Supabase logic and hooks. The rest of the files are just our config files.

Documentation: contains the README.md for our project. Also contains our weekly reports. Also contains our user-guide.md and developer-guide.md just like the README.md

## How to Build the Software

Follow these steps to build and run the project locally:

1. **Clone the repository**
   ```bash
   - git clone https://github.com/NushaS/TicketSpy.git
   - cd TicketSpy
   ```
2. **Create a new branch (optional)**
   ```bash
   - git checkout -b <branch-name>
   ```
3. **Add a `.env.local` file under the main `TicketSpy` directory for the Supabase credentials. In the file, define:**
   - `NEXT_PUBLIC_SUPABASE_URL`=YourSupabaseUrl 
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`=YourSupabaseApiKey
   - `SUPABASE_SERVICE_ROLE_KEY`=YourServiceRoleKey
     
   (Note: This is required, as components that use `/lib/supabase` will throw errors if the credentials are not available.)

   To access our Supabase credentials:
   - if you are a UW student, access them [here](https://docs.google.com/document/d/1XV_wcLVr5xJQiNSPcsQuTWJQUjbESwpbuEIlXwFTbkE/edit?usp=sharing).
   - if you are not a UW student, please email us (emails available via the living document in `Acknowledgements`).
4. **Install dependencies**
   ```bash
   - npm install
   ```
5. **Run the development server**
   ```bash
   - npm run dev
   ```
6. **View the application**
   - Once the build completes successfully, open the URL displayed in your terminal (usually [http://localhost:3000](http://localhost:3000)) to view the website.


## How to Test the Software (CI/CD)

Follow these steps to run and verify the system’s test cases:

1. **Automated test execution (Continuous Integration)**
   We use Husky for pre-commit code validation, and GitHub actions to ensure the remote repository has well-tested and linted code at all times
   - Tests are automatically executed whenever you:
     - Push new code to the repository
     - Create or update a pull request
     - Make a new commit
   - The automated workflow will:
     - Build the project
     - Run all test suites
     - Run the linter (`eslint`)
     - Install all necessary dependencies

2. **Run the linter and tests manually**
   If you want to check for linting or run unit tests (respectively):
   ```bash
   npm run lint
   npm run test
   ```
   Any tests that "npm run test" fails will direct you to the relevant lines of code that failed in the test
   
3. **Check for compile-time issues**
   When running the development server, any build or compile errors will be displayed automatically:
   ```bash
   npm run dev
   ```

## How to Add New Tests

### Adding New Tests

Our script `npm run test` (configured in `package.json`) will run **Jest**.  
Jest will search under the `_tests_` folder by default, as well as any file that matches `*.test.js`, `*.test.ts`, or `*.test.tsx` formats.

In general, our tests will be in the **/app/__tests__/unit** folder and a **/app/__tests__/api** folder

To add a new test:
1.) Decide if it is a unit test or api test
1.1) If it is neither, add a "__tests__" folder under your module and use JEST to write custom tests
2.) Use Jest to write custom tests in the folder! Feel free to use our previous tests as a template

### Naming Conventions/Patterns

- Test file names should reflect the file or component being tested:

  ```
  componentName.test.tsx
  ```

  **Example:** If the component is `MapPin.tsx`, name the test `MapPin.test.tsx`.

- Test descriptions inside the test file should communicate expected behavior.

- Tests should follow a behavior-driven structure:
  - **Arrange:** Set up the component / mocks
  - **Act:** Perform the interaction
  - **Assert:** Verify the expected result (Jest uses expect())

- Keep each test focused on one behavior.

Example.
```
// app/__tests__/unit/formatDistance.test.ts
import { formatDistance } from '@/lib/utils/formatDistance';

describe('formatDistance', () => {
  it('formats meters into a readable string', () => {
    const result = formatDistance(153);   // act
    expect(result).toBe('153 m');         // assert
  });
});
```
## How to Build a Release of the Software

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

## Our version control structure
### "Git Feature workflow"
We use git and a minimal 'Git Feature Workflow' to perform version control

We have 2 main branches
- main (stable, ready to run)
- dev (to catch any integration and code merging errors)

We then branch off 'dev' by using this naming convection
- feature/... (ex. feature/supabase-auth)
- chore/... (ex. chore/insert-developer-guide)
- fix/... (ex. fix/post-ticket-validation)

In our branch from dev (such as feature/supabase-auth), we make a change by doing...
- git add . (or adding individual files)
- git commit -m "Some descriptive message"
- git push
Note: on every commit, we use 'husky pre-commit' to automaticallly test, lint, and build our program

Once our team fully agrees that a branch is no longer needed, we make sure to delete said branch to minimize merge conflicts
- git branch -d feature/supabase-auth
