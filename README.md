# Project Title: Parlez-vous

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/Status-In--Development-green.svg)]()

---

## 📖 Table of Contents
* [Overview](#-overview)
* [Key Features](#-key-features)
* [Security and Integrity](#%EF%B8%8F-security-and-integrity)
* [Tech Stack](#-tech-stack)
* [Preview](#-preview)
* [Future Roadmap](#-future-roadmap)

---

## 🔍 Overview
* A web-app created by and for language-learners.
* Usage: Provides an environment where users can practice preparing and holding presentations about diverse topics from A1 to B2 levels.
* Motivation: I'm currently learning French on my own, and I find it hard to practice speaking. That's why I created this web-app to resolve my own challenges and help others.

## ✨ Key Features
* Users can fetch a randomly chosen topic along with ideas (talking points) and key vocabulary.
* Includes a dedicated notepad field where users can take notes on unknown words. These are saved for users to review and look up later.
* All data is securely saved and synced on the cloud, ensuring users won't lose their progress when switching between devices.

---

## 🛡️ Security and Integrity
| Technology | Why I use it? |
| :--- | :--- |
| Bcrypt library | To encrypt the password on the server before sending and storing it in the database, keeping it safe even if the database is breached. |
| JWT Token | Ensures seamless UX while keeping SPPI (Sensitive Personal Private Information) secure. Credentials are saved in the user's browser in a safe, inaccessible way. |
| CORS-ORIGIN | To only allow API access from designated addresses. |
| HTTPOnly (settings) | To protect users from XSS malware attempting to access and steal stored cookies. |

## 🛠 Tech Stack
| Category | Technology | Why I use it? |
| :--- | :--- | :--- |
| **Frontend** | React, JavaScript | I love the component-based workflow of React, which enables partial reloads and significantly enhances the UX. |
| **Backend** | Node.js, Express | This programming language environment is highly familiar and efficient for Frontend/JS Developers. |
| **Deployment** | Vercel | It is free, fast, and very developer-friendly. |
| **Content** | Deepseek Generative AI | Deepseek accurately generates high-quality content while strictly adhering to the JSON data formatting rules. |
| **Data** | MongoDB | MongoDB is an optimal, scalable database appropriate for apps requiring high volumes of read/write operations (unlike Google Firebase). |

---

## 🔍 Preview

<p align="center">
  <img width="1000" alt="Parlez-vous Demo" src="https://github.com/user-attachments/assets/8eaca5ee-aa44-4e70-b1a7-49cdb1a905a1" />
</p>

---

## 🗺 Future Roadmap
- [ ] Implement the connection within my personal ecosystem (with Lingo-stack).
- [ ] Implement advanced filtering and search algorithms.
- [ ] Add multilingual support (German/French/Vietnamese).
- [ ] Enhance UI/UX with dark mode and custom themes.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact
**Nguyễn Đức Minh**  
*   **Email:** [minhnguyen.de.vn@gmail.com](mailto:minhnguyen.de.vn@gmail.com)
*   **GitHub:** [@minhnguyen19](https://github.com/minhnguyenduc19)
*   **Linkedin:** [@minhnguyendevn](https://www.linkedin.com/in/minhnguyendevn)
