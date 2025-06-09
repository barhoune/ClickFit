# ClickFit

Task implementation for Wave Group interview. [Preview](https://barhoune.github.io/ClickFit/)

## Description

This is a full-stack demo project built as a technical task for On Wave Group's Junior Full Stack Developer position. The project includes a one-page sport/fitness-themed website, image upload functionality with a Node.js backend, and a MySQL user management setup.

## Task Checklist

### Frontend (HTML/CSS/JS only with Bootstrap + jQuery)

- [x] One-page website with title: **Click Fit**
- [x] Responsive design using **only**: HTML, CSS, JavaScript, **Bootstrap**, **jQuery**, and jQuery plugins
- [x] A **sport/fitness theme** with a **nice** design
- [x] At least **two nice animations** to improve user experience
- [x] **AJAX call** after page load to: `http://numbersapi.com/1/30/date?json`
  - [x] Display the returned text visibly on the page
  - [x] Also write the same text to another area on the page

### Image Upload (Client + Node.js Server)
**Important Note** : this feature cannot work on the published page due to github pages not supporting Node.js yet.

- [x] Allow user to **drag & drop or click** to upload image
- [x] Backend built in **Node.js** (no cloud storage)
- [x] Save uploaded files into: `/upload_images/` directory in project root

### Backend: MySQL Task

- [x] MySQL **users table** with fields:
  - `userId`, `email`, `password`, `type`, `active`
- [x] Create a **stored procedure** named `addUser` to insert a new user
- [x] Add a **SQL script** that calls `addUser` with test values
