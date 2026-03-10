# Aether Energy Network: Deployment Protocol (Phase 28)

**Target Environment:** Vercel (Production)
**Stack:** Next.js (App Router), Tailwind CSS, Zustand, Framer Motion

---

## 🛑 SECRETS & SECURITY WARNING
**CRITICAL:** Your `.env.local` contains the `GEMINI_API_KEY`. This key must **NOT** be committed to GitHub.
The `.gitignore` has been audited and will automatically ignore `.env*` files, but it is your responsibility to ensure you never force-add secrets to version control.

---

## Part 1: Initializing Version Control & Pushing to GitHub

Open your terminal at the root of the project (`c:\Users\Thoma\.gemini\antigravity\scratch\aether-energy-network`) and execute the following commands in order:

### 1. Initialize the Repository
```bash
git init
```

### 2. Stage All Valid Files
*(This will respect .gitignore and exclude your API keys)*
```bash
git add .
```

### 3. Commit the Codebase
```bash
git commit -m "Initialize Aether Energy Network"
```

### 4. Link & Push to GitHub
1. Log into [GitHub](https://github.com/) and create a **New Repository**. Name it `aether-energy-network` (do not initialize with a README or .gitignore).
2. Copy the URL provided by GitHub for an existing repository (e.g., `https://github.com/YourUsername/aether-energy-network.git`).
3. Run the following commands to link and push your code:
```bash
git branch -M main
git remote add origin https://github.com/YourUsername/aether-energy-network.git
git push -u origin main
```

---

## Part 2: Vercel Deployment

Once the code is hosted on GitHub, transferring it to Vercel is highly streamlined.

### 1. Connect the Repository
1. Log into your [Vercel account](https://vercel.com/dashboard).
2. Click the **"Add New..."** button and select **Project**.
3. In the "Import Git Repository" section, locate `aether-energy-network` and click **Import**.
4. Vercel will automatically detect the Next.js framework. Leave the specific Build Options as default (`next build`).

### 2. Inject Environment Variables (CRITICAL)
Before you click the Deploy button, locate the **"Environment Variables"** dropdown in the Vercel configuration menu.
1. Key: `GEMINI_API_KEY`
2. Value: *(Paste your actual Google AI Studio API Key here)*
3. Click **Add**.

### 3. Initiate Launch
1. Click **Deploy**.
2. Vercel will now install dependencies, run the `next build` command, and distribute the application globally. 
3. Upon completion, you will be provided a production URL.

*End of Protocol.*
