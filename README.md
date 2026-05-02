# Smart Link Embedder 🔗

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A modern, fast, and privacy-focused web application that seamlessly embeds clickable links directly into PDFs and Images. 

Built entirely client-side, **Smart Link Embedder** processes your files locally in your browser. Images are intelligently converted to high-quality PDFs containing invisible hyperlink overlays, allowing users to click anywhere on the image to open your target URL!

## 🚀 Live Demo

[**View Live Demo**](https://Tanzeel0Hussain.github.io/smart-link-embedder/)

## ✨ Features

- **Drag & Drop Interface**: Beautiful glassmorphism UI with smooth micro-animations.
- **Image Link Embedding**: Automatically converts JPG and PNG images into a perfectly sized PDF with an embedded, full-page clickable link.
- **Native PDF Support**: Modifies existing PDF files to add a clickable overlay over the pages.
- **100% Client-Side**: Your files never leave your computer. Everything is processed directly in the browser for ultimate privacy and speed.
- **Premium Design**: Dark mode aesthetic, vibrant gradients, and fully responsive.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism)
- **PDF Manipulation**: `pdf-lib`
- **Icons**: `lucide-react`

## 📦 Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/Tanzeel0Hussain/smart-link-embedder.git
   ```
2. Navigate to the project directory
   ```bash
   cd smart-link-embedder
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

## 🌐 Deploying to GitHub Pages

This project is already pre-configured for GitHub Pages. To deploy:

1. Push your code to the `master` or `main` branch.
2. Go to your repository settings on GitHub -> **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. GitHub will automatically suggest the **"Vite"** or **"Static HTML"** workflow. Configure it to build and deploy your site.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
MIT
