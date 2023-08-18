# [Next-Dashboard](https://next-dashboard-ashy.vercel.app/)

This repository contains a web application with frontend and backend built using Next.js (with redis caching and next-auth sessions). Below are the instructions on how to install, deploy, run, and use the web app.

## Note

> - You may need to configure your own `.env` file, although I have already provided sample configuration file named `.env.sample` inside the directories.
> - The preview of the web links is working, but you need to wait until it fetches the data from the server, which may take up to 4-5 minutes for the first request. After that, it will take less time.
> - You can verify the application by clicking on the link embedded in the title of the README.

## Installation

1. Clone the repository to your local machine and install the dependencies:

```markdown
git clone https://github.com/aryanverma2506/Next-Dashboard.git
cd Next-Dashboard
npm install
```

## Deployment

To deploy the application, you have two options:

1. Development Build: Run the application in development mode with hot-reloading.

```markdown
npm run dev
```

By default, the application will run on [http://localhost:3000](http://localhost:3000).

2. Production Build: Build the application for production.

```markdown
npm run build
npm start
```

After running the production build, you will have a build directory containing the optimized files.

# Usage

With the application deployed, you can now access the web app through your browser.

1. Open your web browser and go to [http://localhost:3000](http://localhost:3000) (or the specified port if you modified it).

2. The web app will load, and now you need to register by providing the information for the required fields.

3. After registering, you can view and manage your profile, as well as connect with other users through connections.

## Folder Structure

```markdown
Next-Dashboard/
├── public/
│ └── assets/
├── src/
│ ├── app/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── interfaces/
│ ├── lib/
│ ├── models/
│ ├── utils/
│ ├── App.tsx
│ └── globals.d.ts
├── .gitignore
├── .eslintrc.json
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── ...
```
