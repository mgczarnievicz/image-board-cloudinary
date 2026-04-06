# Sun Board 🌅

A gallery app for sunset lovers. Upload, browse, and comment on sunset photos — no account needed.

## Running the Project

1. Clone the repository:

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables — create a `.env.local` file in the project root:

   ```env
   MONGODB_URI=your_mongodb_uri

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   CLOUDINARY_FOLDER=your_cloudinary_folder
   CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   MAX_UPLOAD_SIZE_MB=2
   ```

4. Start the development server:

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Overview

Sun Board is a full-stack web application built with Next.js. It enables users to:

- Upload sunset photos with a title and description
- Browse photos in a responsive grid gallery
- Navigate between posts with previous/next controls
- Leave comments on individual posts
- Edit or delete existing posts

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=nextjs,react,mongodb,tailwind)](https://skillicons.dev)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (Pages Router) |
| UI | React, Tailwind CSS |
| Database | MongoDB via Mongoose |
| Image storage | Cloudinary |
| Data fetching | SWR |
| State management | React useState |

## Preview

<!--
![Sun Board Preview](preview.png)
-->