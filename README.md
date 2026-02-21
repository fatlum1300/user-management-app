# UserHub — User Management App

A React application built for the LinkPlus IT internship challenge. Demonstrates React fundamentals: component architecture, state management with Redux Toolkit, client-side routing, form validation, and API data fetching.

## Live Features

### Core
- **User List** — Fetches 10 users from `jsonplaceholder.typicode.com/users`, displays them in a responsive card grid showing name, email, and company.
- **Search** — Real-time client-side filtering by name or email.
- **User Detail** — Click any card or "View →" to navigate to a full detail page showing address, phone, website, and company info.
- **Add User** — Available via the navbar link or the "+ Add User" button. Form with full validation (name & email required). New users appear at the top of the list.

### Bonus
- **Sorting** — Sort the list by name, email, or company in ascending or descending order via a dropdown.
- **Redux** — Full Redux Toolkit store manages all user state (list, search query, sort config, loading status).

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| React Redux | React bindings for Redux |
| JSONPlaceholder | Mock REST API |

## Getting Started

### Prerequisites
- Node.js 16+ and npm installed

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/fatlum1300/user-management-app.git
cd user-management-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navigation bar
│   ├── UserCard.jsx        # User card with edit/delete actions
│   └── AddEditUserModal.jsx # Reusable modal for add & edit
├── pages/
│   ├── UsersListPage.jsx   # Main page — list, search, sort
│   ├── UserDetailPage.jsx  # Individual user detail view
│   └── AddUserPage.jsx     # Standalone add user page
├── store/
│   ├── index.js            # Redux store configuration
│   └── usersSlice.js       # Users slice: async thunk, reducers, selectors
├── styles/
│   └── global.css          # Global design system styles
├── App.jsx                 # Root component with routing
└── index.js                # ReactDOM entry point
```

## State Management

The Redux store (`usersSlice`) manages:

- `list` — Array of all users (fetched + locally added)
- `status` — `idle | loading | succeeded | failed`
- `error` — Error message string
- `searchQuery` — Current search string
- `sortConfig` — `{ field: "name"|"email"|"company", direction: "asc"|"desc" }`

**Actions:**
- `fetchUsers` — Async thunk that calls the JSONPlaceholder API
- `addUser` — Prepends a new user to the list with `isLocal: true`
- `updateUser` — Updates an existing user by ID
- `deleteUser` — Removes a user by ID
- `setSearchQuery` — Updates search filter
- `setSortConfig` — Updates sort field and direction

**Selectors:**
- `selectFilteredSortedUsers` — Derives the filtered and sorted list from state

## Form Validation

The Add/Edit form validates:
- **Name** — Required, minimum 2 characters
- **Email** — Required, must match email format regex
- **Phone** — Optional, must match phone format if provided

Validation is triggered on blur and on submit. Fields are highlighted with error messages.

## Design

- Dark theme with indigo accent color
- Responsive grid layout (auto-fill cards)
- `Syne` (display) + `DM Sans` (body) typography
- CSS custom properties design system
- Smooth animations and hover effects
- Mobile-friendly at all breakpoints
