# DanMage

Self-link: https://github.com/teststaybaka/danmage

## Overview

DanMage is a project that brings NicoNico-style flow chat (A.K.A., scrolling chat, danmaku, danmu) to multiple video sites as both [a chrome extension](https://chrome.google.com/webstore/detail/danmage/elhaopojedichjdgkglifmijgkeclalm) and a firefox extension (link pending), now supporting YouTube, Twitch and Crunchyroll. It's also deployed as a [website](https://www.danmage.com/), which provides minimum backend support to the extension, such as storing posted chats and player settings.

## Build

To build the chrome extension, run `npm run bext` which dumps the bundled JS files into `./chrome_extension_bin` directory, which can be loaded in debug mode in browsers. It talks directly to the PROD web server.

To build the firefox extension, run `npm run bext_firefox_windows` or `npm run bext_firefox_linux` depending on your OS. The only extra thing it does than `npm run bext` is to copy and rename `firefox_manifest.json` in  `./chrome_extension_bin` directory.

To run the web server locally, run `npm run local` which starts at port 8080.

## Deployment

It's deployed to Google Cloud Platform (GCP) by using [Google Cloud Build](https://cloud.google.com/build) which requires cloudbuild.yaml and Dockerfile.
