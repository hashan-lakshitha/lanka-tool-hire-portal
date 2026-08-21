# Hashan Walauwatta - Git Step-by-Step Execution Guide

**Member Name**: Hashan Lakshitha Walauwatta  
**Student ID**: CB018777  
**Responsibility**: Repository Setup, Project Initial Scaffolding & Initial Git Push

---

## 1. Step 1: GitHub Repository Creation & Collaborators Setup

1. Log in to GitHub and create a new private repository named `shelton-tools` (or `lanka-tool-hire`). Do not check README or .gitignore options in the GitHub creation page.
2. Navigate to **Settings > Collaborators > Add people** and invite **Abdullah Suhail** and **Mohamed Shadil**.
3. Copy your remote repository URL (e.g. `https://github.com/<your-username>/shelton-tools.git`).

---

## 2. Step 2: Local Initialization and Main Branch Push

Open your terminal inside the project directory and execute:

```bash
# 1. Initialize local git repository
git init

# 2. Configure Git identity
git config user.name "Hashan Lakshitha Walauwatta"
git config user.email "hashan@example.com"

# 3. Stage and commit only .gitignore and README
git add .gitignore README.md
git commit -m "chore: initial repository setup with gitignore and project readme"

# 4. Set main branch and link remote origin
git branch -M main
git remote add origin <GITHUB_REPO_URL>

# 5. Push main branch to GitHub
git push -u origin main
```

---

## 3. Step 3: Next.js Project Scaffolding Push (dev branch)

```bash
# 1. Create and switch to integration branch
git checkout -b dev

# 2. Stage Next.js configurations and dependencies
git add package.json package-lock.json next.config.mjs postcss.config.mjs jsconfig.json eslint.config.mjs .env.example .sequelizerc

# 3. Stage base layout and styles
git add src/app/globals.css src/app/layout.js src/app/page.js src/app/favicon.ico src/app/apple-icon.png

# 4. Commit project scaffold
git commit -m "chore: initialize Next.js 14 project scaffold with Tailwind CSS and base configs"

# 5. Push dev branch to GitHub
git push -u origin dev
```

---

## 4. Hashan Feature Branches (Sprint 1 to 8)

Always run `git checkout dev && git pull origin dev` before starting a sprint.

### Sprint 1: Password Reset Workflow
```bash
git checkout dev && git pull origin dev
git checkout -b feature/A-password-reset

git add src/lib/mailer.js src/app/forgot-password/ src/app/reset-password/ src/app/api/auth/forgot-password/ src/app/api/auth/reset-password/ src/app/api/auth/change-password/
git commit -m "feat(auth): implement password reset workflow with email notification support"

git push -u origin feature/A-password-reset
git checkout dev && git merge feature/A-password-reset && git push origin dev
```

### Sprint 2: Equipment Inventory & Admin Management
```bash
git checkout dev && git pull origin dev
git checkout -b feature/L-equipment-management

git add src/app/admin/equipment/ src/app/api/admin/tools/
git commit -m "feat(admin): create tool inventory and equipment management UI"

git push -u origin feature/L-equipment-management
git checkout dev && git merge feature/L-equipment-management && git push origin dev
```

### Sprint 3: Category Filters
```bash
git checkout dev && git pull origin dev
git checkout -b feature/B-category-filters

git add src/app/catalogue/page.js
git commit -m "feat(ui): add category sidebar filter and price sorting controls"

git push -u origin feature/B-category-filters
git checkout dev && git merge feature/B-category-filters && git push origin dev
```

### Sprint 4: Live Search Engine
```bash
git checkout dev && git pull origin dev
git checkout -b feature/C-search-engine

git add src/components/Nav.js src/app/catalogue/page.js
git commit -m "feat(search): add instant debounced search across equipment catalogue"

git push -u origin feature/C-search-engine
git checkout dev && git merge feature/C-search-engine && git push origin dev
```

### Sprint 5: Customer Portal & Quotes Dashboard
```bash
git checkout dev && git pull origin dev
git checkout -b feature/E-customer-quotes

git add src/app/dashboard/page.js src/app/dashboard/quotes/ src/app/dashboard/rentals/ src/app/api/customer/quotes/ src/app/profile/ src/app/api/customer/profile/
git commit -m "feat(dashboard): add customer dashboard for managing quotes and active rentals"

git push -u origin feature/E-customer-quotes
git checkout dev && git merge feature/E-customer-quotes && git push origin dev
```

### Sprint 6: Bayesian Rating & Review UI
```bash
git checkout dev && git pull origin dev
git checkout -b feature/F-rating-components

git add src/lib/rating.js src/components/StarRating.js src/components/ReviewList.js src/app/api/reviews/[id]/comments/
git commit -m "feat(ui): implement StarRating and ReviewList with Bayesian score calculations"

git push -u origin feature/F-rating-components
git checkout dev && git merge feature/F-rating-components && git push origin dev
```

### Sprint 7: Admin Review Moderation Dashboard
```bash
git checkout dev && git pull origin dev
git checkout -b feature/I-admin-moderation

git add src/app/admin/moderation/ src/app/api/admin/reviews/route.js
git commit -m "feat(admin): build moderation console for approving or rejecting customer reviews"

git push -u origin feature/I-admin-moderation
git checkout dev && git merge feature/I-admin-moderation && git push origin dev
```

### Sprint 8: Trilingual Localization (i18n) Support
```bash
git checkout dev && git pull origin dev
git checkout -b feature/P-i18n-localization

git add src/lib/i18n.js src/components/LanguageSwitcher.js src/locales/
git commit -m "feat(i18n): implement trilingual localization support (EN, SI, TA)"

git push -u origin feature/P-i18n-localization
git checkout dev && git merge feature/P-i18n-localization && git push origin dev
```
