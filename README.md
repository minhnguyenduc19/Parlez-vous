## 🛡️ Cybersecurity Architecture
As a project developed by a cybersecurity-focused engineer, this application prioritizes the **CIA Triad** (Confidentiality, Integrity, and Availability) through the following implementations:

### **1. Authentication & Identity Management**
*   **Secure Password Hashing:** Utilizes `bcryptjs` for adaptive hashing, ensuring user credentials are protected against rainbow table and brute-force attacks[cite: 1].
*   **Stateless Authorization:** Implements **JSON Web Tokens (JWT)** via `jsonwebtoken` to manage secure, scalable user sessions[cite: 1].
*   **Secure Cookie Handling:** Employs `cookie-parser` to manage auth tokens, configured for `HttpOnly` and `SameSite` attributes to mitigate **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)** risks[cite: 1].

### **2. Data & Infrastructure Security**
*   **Injection Prevention:** Uses `mongoose` for Object Data Modeling (ODM), providing strict schema validation to prevent **NoSQL Injection** attacks[cite: 1].
*   **Environment Isolation:** Leverages `dotenv` for sensitive secret management (API keys, DB URIs, JWT secrets), ensuring no credentials are leaked in the version control system[cite: 1].
*   **API Security:** Built on an `express` backend with modular middleware for centralized error handling and input sanitization[cite: 1].

### **3. AI Safety**
*   **Secure LLM Integration:** Interfaces with `@google/genai` for AI-powered learning features, with backend-mediated requests to prevent client-side API key exposure[cite: 1].

---

## 🚀 Technical Stack

### **Frontend**
*   **React 19:** Utilizing the latest concurrent rendering features for a highly responsive UI[cite: 1].
*   **Tailwind CSS 4:** Modern utility-first styling with the new `@tailwindcss/vite` engine[cite: 1].
*   **Motion (Framer Motion):** For smooth, performant interface transitions and animations[cite: 1].
*   **Lucide React:** A clean, consistent iconography system[cite: 1].

### **Backend & Database**
*   **Node.js & Express:** A scalable RESTful API architecture[cite: 1].
*   **MongoDB:** NoSQL database for flexible storage of linguistic datasets and user progress[cite: 1].
*   **Vite:** Serving as the next-generation frontend tooling for rapid development[cite: 1].

---

## ✨ Key Features
*   **The Verb Lab:** A specialized environment for mastering French verb conjugations[cite: 1].
*   **AI-Driven Learning:** Integration with Google Gemini for dynamic language assistance[cite: 1].
*   **Visual Progress:** Real-time feedback and state management via React[cite: 1].
*   **Cross-Platform Performance:** Optimized for high-performance hardware including ARM64 architectures (Mac Mini M4 / Surface Laptop 7)[cite: 1].

---

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/parlez-vous.git
    cd parlez-vous
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secure_random_string
    GOOGLE_GENAI_KEY=your_google_ai_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 👤 Author
**Nguyễn Đức Minh**
*   Aspiring Software Engineer & Cybersecurity Professional[cite: 1]
*   Focus: Full-stack Development (React, Node.js, Python) & Security[cite: 1]
*   Current Goal: CompTIA Security+ & C1 German Proficiency[cite: 1]

---

**Note:** This project is part of a portfolio demonstrating secure coding practices and modern web development.[cite: 1]
```
