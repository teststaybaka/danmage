# DanMage

## Overview

DanMage is a project that brings NicoNico-style danmaku (or scrolling chat) to various video sites as [a Chrome extension](https://chrome.google.com/webstore/detail/danmage/elhaopojedichjdgkglifmijgkeclalm), now supporting YouTube, Twitch and Crunchyroll. It's also deployed as a [website](https://www.danmage.com/), which provides minimum backend support to the Chrome extension, such as storing posted chats and player settings.

## Build

To build Chrome extension, run `npm run bext` which generates an extension.zip, which can be downloaded and unzipped to be loaded by Chrome. It talks directly to the PROD web server.

To run the web server locally, run `npm run local` which starts at port 8080.

## Deployment

It's deployed to Google Cloud Platform (GCP) by using [Google Cloud Build](https://cloud.google.com/build) which requires cloudbuild.yaml and Dockerfile.
