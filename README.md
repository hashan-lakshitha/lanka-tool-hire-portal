# Lanka Tool Hire Portal (Pvt) Ltd

A modern, responsive tool-hire review and rental web portal prototype developed with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Sequelize**.

---

## 👥 Project Team: Team 01

| Student Name | Student ID (CB Number) | Role |
| :--- | :--- | :--- |
| **Mohomed Shadil** | `CB018738` | Full-Stack Developer |
| **Abdullah Suhail** | `CB010327` | Full-Stack Developer |
| **Hashan Lakshitha Walauwatta** | `CB018777` | Full-Stack Developer |

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend / API

This project includes server-side API routes (Next.js) and can also be connected to a standalone Node backend. Below are quick setup instructions for both approaches.

Using Next.js API routes (recommended for simple projects)
- Place API handlers under `src/pages/api/` (or `src/app/api` for App Router). Example: `src/pages/api/items.js`.
- Install DB client if not present (you already installed `mysql2`):

```bash
cd lanka-tool-hire-portal
npm install mysql2
```

- Add database environment variables to `.env.local` (do not commit):

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=lanka_tool_hire
```

- Start the dev server:

```bash
npm run dev
```

Standalone Express backend (optional)
- Create a `backend/` folder and add an Express server (example `backend/index.js`) that uses `mysql2` or an ORM.
- From `lanka-tool-hire-portal` run:

```bash
npm init -y
npm install express mysql2 dotenv
```

- Run the backend (example):

```bash
# from backend folder
node index.js
```

Database seeding
- If the project includes a seed script (`script/seed.js`), run it to populate test data:

```bash
node ./script/seed.js
```

Notes
- Keep `.env.local` or `backend/.env` out of source control; add them to `.gitignore`.
- Use connection pooling for MySQL (`mysql2/promise` createPool) in production.
- For sharing in-progress work between machines or with teammates, commit to a feature branch rather than relying on stash.
