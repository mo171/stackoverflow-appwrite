# Stackoverflow-Appwrite Clone

![Stackflow Hero](./public/hero.png)

A robust, full-stack Q&A platform built with **Next.js** and **Appwrite**, inspired by Stack Overflow. This project serves as a comprehensive example of building modern web applications with a focus on clean architecture, beautiful UI, and scalable backend services.

## 🚀 Features

- **Authentication**: Secure user login and registration managed by Appwrite Account services.
- **Questions & Answers**: Users can ask detailed questions using a Markdown editor and provide answers to others' queries.
- **Voting System**: Interactive upvoting and downvoting for both questions and answers to highlight quality content.
- **Best Answer**: Question authors can mark an answer as the "Best Answer" (solved), which highlights it in the UI.
- **Comments**: A polymorphic commenting system allowing discussions on questions and answers.
- **Image Uploads**: Integration with Appwrite Storage for attaching images to questions.
- **Reputation Tracking**: A points-based system that rewards users for high-quality contributions.
- **Modern UI/UX**: Built with Tailwind CSS and MagicUI for a premium, animated interface.
- **Developer Friendly**: Extensively commented codebase tailored for junior developers to understand "how things work under the hood."

## 🛠 Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Primitives**: [MagicUI](https://magicui.design/), [Tabler Icons](https://tabler-icons.io/)
- **Backend (BaaS)**: [Appwrite](https://appwrite.io/) (Auth, Database, Storage, Avatars)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Markdown Editor**: `@uiw/react-md-editor`

## 📂 Project Structure

- `src/app`: Contains Next.js routes, pages, and API handlers.
- `src/components`: Houses reusable UI components, including specialized modules like `magicui` and `ui` primitives.
- `src/models`: Backend-related configurations, data collection schemas, and initialization scripts for Appwrite.
- `src/store`: Global state management using Zustand (e.g., Auth stores).
- `src/utils`: Helper utilities like slug generation and date formatting.
- `src/lib`: Core logic utilities, such as Tailwind class merging (`cn`).

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js (v18 or higher)
- An Appwrite account (Cloud or Self-hosted)

### 2. Download/Installation

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd stackflow-appwrite-main
```

Install the dependencies:

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Appwrite credentials. Refer to `.env.sample` for the required keys:

```bash
NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_admin_api_key
```

### 4. Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## ⚖️ License

Distributed under the MIT License.
