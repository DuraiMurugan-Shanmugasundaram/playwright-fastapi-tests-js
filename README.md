
# Playwright API Automation Framework

This is a robust, scalable API automation testing framework built using **Playwright Test (JavaScript)**. It is designed to validate the complete functionality of a FastAPI-based backend by covering all critical **CRUD operations** for `Books` and `Users`.

The framework supports **parameterized tests**, **HTML reporting**, **CI integration**, and **email notifications**, making it suitable for both local development and enterprise-level pipelines.

## 📑 Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Tools & Languages Used](#tools--languages-used)
- [Prerequisites and Steps to Install the Project](#steps-to-install-the-project-with-prerequisites)
- [Test Scenarios](#test-scenarios)
- [Testing Strategy](#testing-strategy)
- [Run Configurations](#run-configurations)
- [Test Execution Options](#test-execution-options)
- [Email Notification](#email-notification)
- [GitHub](#git-hub)
- [Sample Report](#sample-report)
- [Challenges Faced](#challenges-faced)
- [Future Expansion Ideas](#future-expansion-ideas)
- [Author](#author)

## ✅ Features
- End-to-end API automation using Playwright Test (JavaScript)
- Full CRUD operations for Book and User APIs
- Positive & Negative test cases with request chaining
- Parameterized test execution with JSON input files
- Config loader based on `NODE_ENV`
- HTML report generation with pass/fail/skip summary
- GitHub Actions CI Integration
- Email reporting with attachment and screenshot of failures
- Tag-based filtering for targeted test execution

## 🗂 Project Structure
```
playwright-api-framework/
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions workflow
├── config/
│   ├── dev.json
│   ├── qa.json
│   └── prod.json               # Environment-specific config
├── email/
│   └── sendReport.js          # Email reporting module
├── reports/                   # HTML report and screenshots
├── testdata/
│   ├── book.json
│   └── user.json              # Parameterized input files
├── tests/
│   ├── book.spec.js
│   └── user.spec.js           # Main test files
├── utils/
│   ├── configLoader.js        # Loads environment config
│   └── utils.js               # Common utilities
├── .env                       # Env variables for local dev
├── package.json               # Project metadata & scripts
├── playwright.config.js       # Playwright global config
└── README.md                  # Project documentation
```

## 🛠 Tools & Languages Used

The framework is built using the following tools and technologies:

| Tool / Language   | Purpose                                         |
|------------------|-------------------------------------------------|
| **JavaScript**   | Core language for scripting                     |
| **Node.js**      | Runtime environment for JavaScript              |
| **Playwright**   | End-to-end testing framework for API & UI       |
| **dotenv**       | Manage environment variables                    |
| **Nodemailer**   | For sending email notifications with attachments|
| **GitHub Actions** | Continuous Integration / Deployment (CI/CD)   |
| **VSCode**       | Recommended IDE for code editing                |
| **JSON**         | Format for storing test data                    |

> **Tip:** Playwright offers built-in test runner, report generation, and can support API, UI, and headless testing all in one.

---

## 🧰 Steps to Install the Project with Prerequisites

To set up this project locally or in CI/CD pipelines:

### 🔧 Prerequisites
- Node.js (v18 or later)
- Visul Studio Code Editor
- npm (v9 or later)
- Git CLI
- FastAPI service running locally or remotely
- Internet connection (to install dependencies and run CI workflows)

### 📦 Installation Steps

```bash
# Step 1: Clone the repository
git clone https://github.com/your-username/playwright-api-framework.git
cd playwright-api-framework

# Step 2: Open Visual Studio
import the project

# Step 2: Install dependencies
npm install

# Step 3: Install Playwright browsers (required by Playwright)
npx playwright install

# Step 4: Configure environment variables (for local runs)
cp .env.example .env
# Edit the .env file or config/dev.json with your baseURL and email credentials

# Step 5: Run tests locally
NODE_ENV=dev npx playwright test

# Optional: Open HTML report
npx playwright show-report
```

> You can also integrate this with your CI/CD platform (GitHub Actions is pre-configured).

---

## 🧾 Test Scenarios

This framework includes comprehensive positive and negative test cases for two main API domains: `Books` and `Users`.

### 📚 Book API Test Coverage
- ✅ Create a Book with valid details
- ❌ Create a Book with missing/invalid fields (e.g., no title, invalid ISBN)
- ✅ Read a Book by valid ID
- ❌ Read a Book by non-existent ID
- ✅ Update Book details successfully
- ❌ Attempt to update a Book that doesn't exist
- ✅ Delete Book by valid ID
- ❌ Attempt to delete non-existent Book

### 👤 User API Test Coverage
- ✅ Create a User with valid name and email
- ❌ Create a User with missing or invalid email
- ✅ Read a User by ID
- ❌ Read a User with invalid ID
- ✅ Update a User's name or email
- ❌ Attempt to update a non-existent user
- ✅ Delete a User successfully
- ❌ Try deleting an invalid user

### ✅ Test Metadata
- All tests are tagged (e.g., `@CreateBook`, `@UpdateUser`) to allow selective execution
- Status code validations: 200, 201, 204, 400, 404
- Response body assertions using `expect().toMatchObject()`

> **Goal:** Ensure your API handles valid inputs correctly and rejects invalid inputs gracefully.

## 🧠 Testing Strategy
- Modular test files with parameterized data input
- Tests grouped using tags and descriptive names
- Chained requests (create then read/update/delete)
- Failures captured with screenshots and logs

## ⚙️ Run Configurations
- Set environment: `NODE_ENV=dev`, `qa`, or `prod`
- Use tag filtering with `TEST_TAG`
- Reports are saved under `reports/html-report`

## 🧪 Test Execution Options
```bash
npx playwright test                     # Run all tests
TEST_TAG=@CreateBook npx playwright test  # Run filtered by tag
NODE_ENV=qa npx playwright test         # Run against QA environment
```

## 📧 Email Notification
- Email setup via `.env` or `config/dev.json`
- Sends test summary, HTML report, and failure screenshots
```bash
node email/sendReport.jsx`
```

## 🌐 GitHub
### CI Workflow (`.github/workflows/ci.yml`):
- Runs on push or PR to `main`
- Installs dependencies and runs tests
- Generates HTML report
- Uploads report as artifact
- Sends email notification

Secrets Required:
- `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` (in GitHub Settings > Secrets)

## 📊 Sample Report
Run this to view:
```bash
npx playwright show-report
```

## ⚠️ Challenges Faced
- Async chaining between tests
- Tag-filtered execution across environments
- Email attachment handling for screenshots

## 🧱 Future Expansion Ideas
- Add authentication headers/tokens
- Add Swagger spec validation
- Add Dockerfile for containerized execution
- Add CSV/YAML test data support

## ✍️ Author
**DuraiMurugan_Shanmugasundaram**
