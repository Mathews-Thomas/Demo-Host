# React + Vite Todo Management App

This is a full-stack Todo management application built with **React** and **Vite** on the frontend and **Express** and **MongoDB** on the backend. The app allows users to create projects, manage todos, and export project summaries as a GitHub Gist. It includes features like user authentication (login/register), adding, updating, marking as complete, and deleting todos.

## Features

- **User Authentication**: 
  - **Register**: New users can create an account.
  - **Login**: Existing users can log in to manage their projects and todos.
  - Authentication is required to access the app features.
  
- **Create Projects**: Users can create new projects with unique titles.
- **Manage Todos**: Within each project, users can:
  - Add new todos.
  - Edit existing todos.
  - Mark todos as complete or pending.
  - Delete todos.
- **Export to GitHub Gist**: Export project summaries to GitHub as secret gists in Markdown format. The summary includes:
  - Project title.
  - Number of completed todos out of total todos.
  - Lists of pending and completed todos.
- **Tailwind CSS**: Styled using Tailwind for rapid UI development and responsive design.
- **MongoDB Integration**: Stores user, project, and todo data securely.
- **JWT Authentication**: Secures login and registration.

## Project Structure

This project is split into two branches:
- **Frontend (React + Vite)**: Responsible for user interface and interactions.
- **Backend (Express + MongoDB)**: Handles authentication, project/todo management, and Gist export.

## Run Project

**Clone the repository**
```bash
npm install 
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev


### Frontend Structure

```bash
src/
│
├── pages/          # Application views such as ProjectList, ProjectDetails, Login, Register
├── services/       # API integration services
├── utils/          # Utility functions
├── App.jsx         # Main application component
├── index.jsx       # Application entry point
└── styles.css      # Global styles (Tailwind)
