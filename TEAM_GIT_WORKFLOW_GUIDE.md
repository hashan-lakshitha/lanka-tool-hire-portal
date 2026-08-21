# Lanka Tool Hire - Team Git Branching & Commit Workflow Master Guide

**Module**: COMP70066 Software Engineering Principles and Practices  
**Project**: Lanka Tool Hire (Pvt) Ltd (Shelton Tool Hire) Review & Hire Portal  
**Target Duration**: 8 Sprints (10 Aug 2026 – 04 Oct 2026)

---

## 1. Team Members & Roles

| Member Name | Student ID | GitHub Responsibility & Focus Area |
| :--- | :--- | :--- |
| **Hashan Lakshitha Walauwatta** | **CB018777** | Repo Init & Next.js Scaffolding, Password Reset, Reviews/Ratings, Moderation, Trilingual (i18n) |
| **Abdullah Suhail** | **CB010327** | Scrum Master, Auth/Security, Navigation & Core Layouts, Rental Cost Calculator, Releases & Tags |
| **Mohamed Shadil** | **CB018738** | Database Migrations & Sequelize Models, Image/Media Upload API, Inventory Checks, Admin Analytics |

---

## 2. Git Policies & Rules (Academic Compliance)

1. **Branch Hierarchy**:
   - **`main`**: Production-ready branch. **Never commit directly to `main`**. Sprints merge from `dev` at the end of each sprint with release tags (`v0.1` to `v0.8`).
   - **`dev`**: Main Integration branch. All sprint feature branches merge into `dev`.
   - **`feature/<epic-id>-<short-description>`**: Dedicated feature branch per user story.
2. **Commit Standard**: Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
3. **Sync Rule**: Always run `git checkout dev` and `git pull origin dev` **before** creating a new feature branch.

---

## 3. Initial Git Configuration (Run Once per Machine)

Configure your Git identity on your local workstation before making commits:

### Hashan Walauwatta:
```bash
git config user.name "Hashan Lakshitha Walauwatta"
git config user.email "hashan@example.com"
```

### Abdullah Suhail:
```bash
git config user.name "Abdullah Suhail"
git config user.email "suhail@example.com"
```

### Mohamed Shadil:
```bash
git config user.name "Mohamed Shadil"
git config user.email "shadil@example.com"
```

---

## 4. Phase 0: Repository Setup & Initial Push (Hashan Walauwatta)

### Step 1: GitHub Repository Creation
1. Create a new private repository on GitHub: `shelton-tools` (or `lanka-tool-hire`).
2. Go to **Settings > Collaborators** and invite **Abdullah Suhail** and **Mohamed Shadil**.

### Step 2: Local Initialization & Main Branch Push
```bash
git init
git add .gitignore README.md
git commit -m "chore: initial repository setup with gitignore and project readme"
git branch -M main
git remote add origin <GITHUB_REPO_URL>
git push -u origin main
```

### Step 3: Next.js Project Scaffolding Push (dev branch)
```bash
git checkout -b dev

# Stage Next.js configurations and dependencies
git add package.json package-lock.json next.config.mjs postcss.config.mjs jsconfig.json eslint.config.mjs .env.example .sequelizerc

# Stage initial layout and styling
git add src/app/globals.css src/app/layout.js src/app/page.js src/app/favicon.ico src/app/apple-icon.png

git commit -m "chore: initialize Next.js 14 project scaffold with Tailwind CSS and base configs"
git push -u origin dev
```

---

## 5. Phase 0.1: Repository Cloning (Suhail & Shadil)

Once Hashan has pushed `dev`, Suhail and Shadil clone the repository:
```bash
git clone <GITHUB_REPO_URL>
cd shelton-tools
git checkout dev
```

---

## 6. Sprint-by-Sprint Execution Workflow (Sprints 1 to 8)

---

### Sprint 1 (Aug 10 - Aug 16): Account & Staff Foundations (Epics A, M, O)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/A-database-setup

# Stage database configuration, migrations, and User model
git add src/config/ src/lib/db.js migrations/20240101000001-create-users.js src/models/user.js src/models/index.js
git commit -m "feat(db): setup Sequelize connection and User model with migration"
git push -u origin feature/A-database-setup
git checkout dev && git merge feature/A-database-setup && git push origin dev
```

#### 2. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/A-auth-system

# Stage NextAuth, registration API, navigation, and auth pages
git add src/lib/auth.js src/middleware.js src/app/api/auth/[...nextauth]/ src/app/api/auth/register/ src/app/providers.js
git add src/components/Nav.js src/app/login/ src/app/register/
git commit -m "feat(auth): integrate NextAuth authentication and user registration portal"
git push -u origin feature/A-auth-system
git checkout dev && git merge feature/A-auth-system && git push origin dev
```

#### 3. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/A-password-reset

# Stage mailer utility and password reset pages/routes
git add src/lib/mailer.js src/app/forgot-password/ src/app/reset-password/ src/app/api/auth/forgot-password/ src/app/api/auth/reset-password/ src/app/api/auth/change-password/
git commit -m "feat(auth): implement password reset workflow with email notification support"
git push -u origin feature/A-password-reset
git checkout dev && git merge feature/A-password-reset && git push origin dev
```

#### Sprint 1 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.1 -m "Release v0.1: User authentication, database foundations, and base layout"
git push origin main --tags
```

---

### Sprint 2 (Aug 17 - Aug 23): Equipment Catalogue & Media (Epics J, L)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/J-catalogue-models

# Stage Category/Tool models, migrations, and upload endpoint
git add migrations/20240101000003-create-categories.js migrations/20240101000004-create-tools.js src/models/category.js src/models/tool.js src/app/api/admin/upload/
git commit -m "feat(models): add Category and Tool schemas with image upload API"
git push -u origin feature/J-catalogue-models
git checkout dev && git merge feature/J-catalogue-models && git push origin dev
```

#### 2. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/J-admin-categories

# Stage admin portal layout and category management module
git add src/app/admin/layout.js src/app/admin/page.js src/app/admin/login/ src/app/admin/categories/ src/app/api/admin/categories/ src/models/adminUser.js migrations/20240101000002-create-admin-users.js src/lib/adminStyles.js
git commit -m "feat(admin): build admin portal layout and category management module"
git push -u origin feature/J-admin-categories
git checkout dev && git merge feature/J-admin-categories && git push origin dev
```

#### 3. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/L-equipment-management

# Stage admin equipment inventory interface
git add src/app/admin/equipment/ src/app/api/admin/tools/
git commit -m "feat(admin): create tool inventory and equipment management UI"
git push -u origin feature/L-equipment-management
git checkout dev && git merge feature/L-equipment-management && git push origin dev
```

#### Sprint 2 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.2 -m "Release v0.2: Equipment catalogue, admin management, and media upload"
git push origin main --tags
```

---

### Sprint 3 (Aug 24 - Aug 30): Pricing Rules & Browsing (Epics K, B)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/K-public-catalogue-api

git add src/app/api/tools/route.js src/app/api/categories/route.js
git commit -m "feat(api): create public catalogue listing endpoints with filtering support"
git push -u origin feature/K-public-catalogue-api
git checkout dev && git merge feature/K-public-catalogue-api && git push origin dev
```

#### 2. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/B-catalogue-ui

git add src/components/ToolCard.js src/app/catalogue/page.js src/lib/theme.js
git commit -m "feat(ui): design responsive ToolCard and catalogue browsing page"
git push -u origin feature/B-catalogue-ui
git checkout dev && git merge feature/B-catalogue-ui && git push origin dev
```

#### 3. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/B-category-filters

git add src/app/catalogue/page.js
git commit -m "feat(ui): add category sidebar filter and price sorting controls"
git push -u origin feature/B-category-filters
git checkout dev && git merge feature/B-category-filters && git push origin dev
```

#### Sprint 3 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.3 -m "Release v0.3: Public catalogue browsing, card components, and filtering"
git push origin main --tags
```

---

### Sprint 4 (Aug 31 - Sep 06): Detail Pages & Search Engine (Epics D, C)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/C-inventory-checker

git add src/lib/inventory.js src/app/api/tools/[id]/route.js
git commit -m "feat(inventory): add availability check helper and single tool lookup API"
git push -u origin feature/C-inventory-checker
git checkout dev && git merge feature/C-inventory-checker && git push origin dev
```

#### 2. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/D-tool-detail-page

git add src/app/tools/[id]/page.js
git commit -m "feat(ui): create dynamic tool specifications and availability detail view"
git push -u origin feature/D-tool-detail-page
git checkout dev && git merge feature/D-tool-detail-page && git push origin dev
```

#### 3. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/C-search-engine

git add src/components/Nav.js src/app/catalogue/page.js
git commit -m "feat(search): add instant debounced search across equipment catalogue"
git push -u origin feature/C-search-engine
git checkout dev && git merge feature/C-search-engine && git push origin dev
```

#### Sprint 4 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.4 -m "Release v0.4: Tool details page, search bar, and inventory verification"
git push origin main --tags
```

---

### Sprint 5 (Sep 07 - Sep 13): Rental Cost Calculator (Epic E)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/E-rental-models

git add migrations/20240101000007-create-rental-quotes.js migrations/20240101000009-create-rentals-and-tool-quantity.js src/models/rentalQuote.js src/models/rental.js src/app/api/rentals/ src/app/api/customer/rentals/
git commit -m "feat(models): implement RentalQuote and Rental entities with database migrations"
git push -u origin feature/E-rental-models
git checkout dev && git merge feature/E-rental-models && git push origin dev
```

#### 2. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/E-hire-calculator

git add src/components/HireCalculator.js src/app/api/quote/route.js
git commit -m "feat(calc): build interactive HireCalculator with deposit and duration logic"
git push -u origin feature/E-hire-calculator
git checkout dev && git merge feature/E-hire-calculator && git push origin dev
```

#### 3. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/E-customer-quotes

git add src/app/dashboard/page.js src/app/dashboard/quotes/ src/app/dashboard/rentals/ src/app/api/customer/quotes/ src/app/profile/ src/app/api/customer/profile/
git commit -m "feat(dashboard): add customer dashboard for managing quotes and active rentals"
git push -u origin feature/E-customer-quotes
git checkout dev && git merge feature/E-customer-quotes && git push origin dev
```

#### Sprint 5 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.5 -m "Release v0.5: Rental cost calculator, quote generation, and customer portal"
git push origin main --tags
```

---

### Sprint 6 (Sep 14 - Sep 20): Reviews, Ratings & Comments (Epics F, G)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/F-review-models

git add migrations/20240101000005-create-reviews.js migrations/20240101000008-create-review-comments.js src/models/review.js src/models/reviewComment.js
git commit -m "feat(models): add Review and ReviewComment schemas with relational associations"
git push -u origin feature/F-review-models
git checkout dev && git merge feature/F-review-models && git push origin dev
```

#### 2. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/F-rating-components

git add src/lib/rating.js src/components/StarRating.js src/components/ReviewList.js src/app/api/reviews/[id]/comments/
git commit -m "feat(ui): implement StarRating and ReviewList with Bayesian score calculations"
git push -u origin feature/F-rating-components
git checkout dev && git merge feature/F-rating-components && git push origin dev
```

#### 3. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/F-review-submission

git add src/components/ReviewForm.js src/app/api/reviews/route.js src/app/dashboard/reviews/ src/app/api/customer/reviews/
git commit -m "feat(reviews): build ReviewForm submission and customer review history"
git push -u origin feature/F-review-submission
git checkout dev && git merge feature/F-review-submission && git push origin dev
```

#### Sprint 6 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.6 -m "Release v0.6: Customer reviews, star ratings, and community comments"
git push origin main --tags
```

---

### Sprint 7 (Sep 21 - Sep 27): Company Responses & Moderation (Epics H, I, J5)

#### 1. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/H-company-response-model

git add migrations/20240101000006-create-company-responses.js src/models/companyResponse.js
git commit -m "feat(models): create CompanyResponse entity and database migrations"
git push -u origin feature/H-company-response-model
git checkout dev && git merge feature/H-company-response-model && git push origin dev
```

#### 2. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/I-admin-moderation

git add src/app/admin/moderation/ src/app/api/admin/reviews/route.js
git commit -m "feat(admin): build moderation console for approving or rejecting customer reviews"
git push -u origin feature/I-admin-moderation
git checkout dev && git merge feature/I-admin-moderation && git push origin dev
```

#### 3. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/H-official-response

git add src/app/api/admin/reviews/[id]/response/route.js src/app/admin/rentals/ src/app/api/admin/rentals/
git commit -m "feat(admin): implement official staff response API and admin rentals management"
git push -u origin feature/H-official-response
git checkout dev && git merge feature/H-official-response && git push origin dev
```

#### Sprint 7 Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.7 -m "Release v0.7: Review moderation workflow and official company responses"
git push origin main --tags
```

---

### Sprint 8 (Sep 28 - Oct 04): Reporting, Testing & Release (Epics N, P)

#### 1. Hashan Walauwatta:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/P-i18n-localization

git add src/lib/i18n.js src/components/LanguageSwitcher.js src/locales/
git commit -m "feat(i18n): implement trilingual localization support (EN, SI, TA)"
git push -u origin feature/P-i18n-localization
git checkout dev && git merge feature/P-i18n-localization && git push origin dev
```

#### 2. Mohamed Shadil:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/N-admin-analytics

git add src/app/admin/analytics/ src/app/api/admin/analytics/ public/
git commit -m "feat(analytics): implement admin analytics dashboard with revenue charts"
git push -u origin feature/N-admin-analytics
git checkout dev && git merge feature/N-admin-analytics && git push origin dev
```

#### 3. Abdullah Suhail:
```bash
git checkout dev && git pull origin dev
git checkout -b feature/release-polish

git add script/ README.md
git commit -m "docs: finalize deployment instructions and seed scripts for production"
git push -u origin feature/release-polish
git checkout dev && git merge feature/release-polish && git push origin dev
```

#### Sprint 8 Final Release (Abdullah Suhail):
```bash
git checkout main && git pull origin main
git merge dev
git tag -a v0.8 -m "Release v0.8: Final release candidate with analytics and full localization"
git push origin main --tags
```

---

## 7. Best Practices & Team Guidelines

- **Zero Secrets Policy**: Never commit `.env` files with production credentials. Commit `.env.example` only.
- **Pre-Branch Synchronization**: Always sync your local repository before starting new work (`git checkout dev && git pull origin dev`).
- **Commit Message Formatting**: Use lowercase standard prefixes (`feat:`, `fix:`, `chore:`, `docs:`).
- **Code Review**: Ensure feature branches merge cleanly into `dev` without fast-forward conflicts.
