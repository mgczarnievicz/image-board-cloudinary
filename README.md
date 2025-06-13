# Image Board App 🖼️

An Instagram-like single-page application that allows users to upload, view, and comment on images. Open to all users without registration, this app is a lightweight clone of modern image-sharing platforms.

## Running the Project

1. Clone the repository.

2. Install dependencies.

3. Set up environment variables (`env.local`) for AWS credentials, S3 bucket and postgres:

   ```env
    MONGODB_URI=your_mongodb_uri


    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_SECRET=your_cloudinary_secret
    CLOUDINARY_FOLDER=your_cloudinary_folder
    CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload
    MAX_UPLOAD_SIZE_MB=your_max_size
   ```

4. Start the server:

   ```bash
   pnpm run dev
   ```

## Overview

The Image Board App is a full-stack web application built with Next.js. It enables users to:

- Upload images with titles and descriptions
- View images in a masonry-style gallery
- Leave comments on individual posts
- Automatically load more images with infinite scroll
- Store uploaded files on Cloudinary

## Features

- 📸 Image upload with title & description
- 💬 Commenting system
- 🔄 Infinite scrolling for seamless UX
- ☁️ Cloudinary image storage
- ⚡ Fast and reactive UI with React

## Technologies

[![My Skills](https://skillicons.dev/icons?i=nextjs,css,mongodb,react)](https://skillicons.dev)

- JavaScript
- Next.js
- React
- MongoDB
- Cloudinary

<!--

## Preview

![Image Board Preview](preview.png) 

 Replace with your own screenshot
 
  -->
