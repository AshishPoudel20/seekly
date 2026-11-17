# Seekly

An AI-powered app discovery engine. Describe what you want to do in plain language — "edit videos on my phone," "split a bill with friends," "learn guitar" — and Seekly recommends the apps that actually fit, with a clear explanation of why each one made the list.

## Try it on Android

- **Download:** [Seekly 1.0.0 Android preview APK](https://github.com/AshishPoudel20/seekly/releases/download/v1.0.0-preview/Seekly-1.0.0-preview.apk)
- **Release page:** [v1.0.0-preview](https://github.com/AshishPoudel20/seekly/releases/tag/v1.0.0-preview)
- **Backup download (Expo):** [APK artifact](https://expo.dev/artifacts/eas/RyNvhKImSrSufmNvxSi9JKYK6bDXsnRY7UISx6uflVc.apk)
- **Install:** download the APK on an Android phone, open it, and allow installs from this source when prompted.
- **Try it:** search for something like "edit videos" or "learn Spanish", open an app's details, and tap the store button.
- AI results run on a free tier and may be limited on busy days; the app then shows basic matches.
- Android only for now.

## What it does

- **Natural-language search** — type a goal instead of guessing keywords, and get a ranked list of relevant apps.
- **Why it fits** — every result comes with a short, specific reason tied to your search.
- **Detailed app pages** — tap any result to see what you can do with the app, the practical things to know (free vs paid, accounts, offline support, ads, privacy), and answers to the questions people actually ask.
- **Deep linking** — open an app's store page directly from a result.
- **Fast and cached** — detail pages load instantly after the first view, since AI responses are cached per app and search.

## Tech stack

**Frontend**
- React Native (Expo)
- Built and distributed with EAS

**Backend**
- Node.js / Express
- Groq API for the language model
- Deployed on Railway

## Running it locally

You'll need Node.js and the Expo CLI installed.

**Backend**

    cd backend
    npm install

Create a `.env` file in the backend directory:

    GROQ_API_KEY=your_groq_api_key
    PORT=4000

Then start the server:

    npm start

**Frontend**

    cd Seekly
    npm install
    npx expo start

Scan the QR code with the Expo Go app on your phone, or run it on an emulator. Point the frontend at your backend by setting the API base URL in `api.js`.

## Deployment

The backend is deployed on Railway:

    railway up

The Android build is produced with EAS:

    eas build --profile preview --platform android

## How the detail pages work

Tapping an app opens the modal immediately with the hero image and basic info, so there's no waiting. In the background it fetches the AI-generated sections (use cases, things to know, common questions), which fill in as they arrive — usually within a couple of seconds the first time. Responses are cached per app-and-search combination, so the same lookup is instant for everyone afterward, and one popular app costs a single AI call rather than one per user.

## Status

Seekly is an active personal project.
