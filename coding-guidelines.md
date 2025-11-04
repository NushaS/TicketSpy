For TypeScript:
https://developers.google.com/blockly/guides/contribute/core/style_guide
Following TypeScript guidelines is important to make sure we have type safety so no unexpected type mismatches occurred. Proper styling of code makes it easier for the team to understand each other's code and create consistency. We plan to enforce these using Husky and lint-staged which are git hooks which enforce linters before pushing commits.

For SQL:
https://cloud.google.com/spanner/docs/sql-best-practices
SQL guidelines help improve both readability and query performance. Poorly written sql can cause inefficiencies in executing queries which significantly slows down database access especially at high loads. Supabase has a built in linter which we will use to ensure proper naming and style.
