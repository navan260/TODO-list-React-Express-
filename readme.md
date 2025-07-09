# 1TodoList

A simple and efficient to-do list application built with React (frontend) and Express (backend).

## Features

- Add, edit, and delete tasks
- Mark tasks as completed

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

Clone the repository and install dependencies for both backend and frontend:

```bash
git clone https://github.com/yourusername/1todolist.git
cd 1todolist
npm run install
```

### Running the Application

#### Start both backend and frontend

```bash
npm start
```

This will concurrently start the Express backend (`backend/app.js`) and the React frontend (`frontend`).

#### Start only the backend

```bash
npm run backend
```

#### Start only the frontend

```bash
npm run frontend
```

#### Run tests

```bash
npm test
```

> **Note:** The default `npm test` script is a placeholder. Add your test scripts as needed.

## Project Structure

```
/1todolist
    ├── backend/
    │   └── app.js
    ├── frontend/
    │   └── (React app files)
    ├── package.json
    └── README.md
```

