# Next.js Gemini AI Chatbot

A professional chatbot UI built with Next.js and Google's Gemini AI API. This application features a sleek, modern interface with a focus on user experience and aesthetics.

## Features

- 💬 Real-time chat interface with Google Gemini AI
- 🌓 Light/Dark mode with smooth transitions
- 🎨 Sleek design with rounded chat bubbles
- 📱 Fully responsive layout
- ⌨️ Smooth typing animations and indicators
- 🔄 Automatic scrolling to new messages

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Google Generative AI SDK
- Framer Motion for animations
- React Icons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-gemini-chatbot.git
   cd nextjs-gemini-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Usage

Simply type your message in the input field at the bottom of the screen and press Enter or click the Send button. The AI will respond in a few moments.

## Customization

You can customize the appearance by modifying the Tailwind configuration in `tailwind.config.js` and the global styles in `app/globals.css`.

## License

MIT

## Acknowledgements

- Google for the Gemini AI API
- Vercel for Next.js
- The open-source community for the amazing tools and libraries 