# Repository Guidelines

## Project Structure & Module Organization

This repository is an Angular 22 standalone application for the AEVN Command Dashboard.

- `src/app/`: application code. Main UI and logic live in `app.ts` and `app.html`.
- `src/app/member.model.ts`: shared member and faction types.
- `src/app/member-data.service.ts`: Firestore access, sample data, and local fallback.
- `src/app/firebase.ts`: Firebase app, Auth, Firestore, and Analytics setup.
- `src/styles.css`: global theme, layout, and responsive styling.
- `src/app/*.spec.ts`: unit tests.
- `public/`: static assets copied into the build.
- `firestore.rules` and `firestore.indexes.json`: Firestore security and index config.
- `dist/`: generated build output; do not edit manually.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the Angular dev server, usually at `http://localhost:4200/`.
- `npm start -- --host 127.0.0.1 --port 4201`: run on a specific host/port.
- `npm run build`: create a production build in `dist/dctq/browser`.
- `npm test -- --watch=false`: run the Vitest-based Angular unit tests once.
- `npx -y firebase-tools@latest deploy --only firestore:rules --dry-run`: validate Firestore rules without deploying.

## Coding Style & Naming Conventions

Use TypeScript with Angular standalone components and services. Follow `.editorconfig`: UTF-8, 2-space indentation, final newline, and trimmed trailing whitespace. Use single quotes in TypeScript and Prettier settings from `.prettierrc` (`printWidth: 100`). Prefer clear Angular naming such as `*.service.ts`, `*.model.ts`, and `*.spec.ts`. Keep component CSS small; broad layout styles belong in `src/styles.css`.

## Testing Guidelines

Tests use Angular's test builder with Vitest and jsdom. Place tests beside the file they cover using the `*.spec.ts` suffix. For UI changes, update or add component tests that verify rendered text, state changes, or service integration. Always run `npm test -- --watch=false` before submitting changes.

## Commit & Pull Request Guidelines

The current Git history is minimal (`init`, `Update README.md`), so use clear imperative commit messages going forward, for example `Add member filtering controls` or `Harden Firestore member rules`. Pull requests should include a short summary, verification commands run, linked issues or task notes, and screenshots for visible UI changes.

## Security & Configuration Tips

Do not commit secrets or environment-specific credentials. Firebase config is public client config, but Firestore access must remain controlled by `firestore.rules`. Treat the current rules as a prototype for internal use; harden with admin claims or an allowlist before broad deployment.

