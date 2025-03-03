# Active Reader
Active Reader is an interactive app that enhances reading comprehension by transforming passive reading into an active learning experience. It automatically creates fill-in-the-blank exercises from any text you provide.

## Features
* Text Processing: Paste in any text and the application will intelligently blank out words
* Interactive Learning: Fill in blanks to actively engage with the content
* Real-time Feedback: Get immediate feedback on your answers
* Smart Word Selection: Algorithm targets important words based on length and significance
* Difficulty Settings: Customize the frequency of blanked-out words
* Dark Mode: Toggle between light and dark themes for comfortable reading
* Accessibility Options: Optional dyslexic-friendly font

## How It Works
* Copy and paste text into the input area
* Choose your difficulty settings
* Start filling in the blanks
* Get immediate feedback on your answers
* Track your progress and learning

## Why Active Reading?
Research shows that active engagement with text significantly improves comprehension and retention. By challenging yourself to recall key words within context, you're strengthening neural pathways and deepening your understanding of the material.

## Technical Implementation
Built with:
* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
The application features a client-side text processing algorithm that intelligently selects words to blank out based on word importance, length, and frequency settings. The UI components provide real-time feedback and track user progress throughout the exercise.

## Getting Started
1. Clone the repo
2. Create a .env file with a free Groq API Key GROQ_API_KEY=
3. Run npm install, npm run dev
4. Open http://localhost:3000 with your browser to start using Active Reader.