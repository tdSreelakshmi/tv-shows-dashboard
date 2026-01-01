# Show Glance

**Show Glance** is a TV show discovery application. It allows users to browse top-rated shows by genre, search for specific titles, and view detailed information about shows, cast members and episodes.

---
### Live Demo

The application is deployed using Firebase Hosting and is available here:

https://social-app-c0037.web.app/
---

## Features

- **Curated Discovery**  
  Browse shows automatically categorised by genre and sorted by popularity or rating.

- **Deep Search**  
  Search functionality to find any show in the TVMaze database.

- **Cast & Character Insights**  
  Explore detailed cast lists and see other shows featuring your selected actor.

- **Season & Episode Guide**  
  View season list, including episode summaries.
---

## Architectural Overview

- **Vue.js 3**  
  Chosen for its efficient reactivity and component-based structure, ensuring a fast and maintainable UI.

- **Vuex**  
  Centralised state management to handle complex data relationships (such as genre mapping) and shared UI states across the app.

- **IndexedDB**  
  Implemented for client-side data persistence, providing significantly faster load times.

- **Sass (SCSS)**  
  Utilised for styling and consistent branding through global variables.

---

## Prerequisites

To run Show Glance locally, ensure your environment meets the following requirements:

- **Node.js:** v22.18.0  
- **NPM:** v10.9.3  

---

## Getting Started

## Installation

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/tdSreelakshmi/tv-shows-dashboard.git
cd tv-shows-dashboard
npm install
```
## Development

Run the local development server with hot reload enabled:

```bash
npm run serve
```

