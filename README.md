# Iliad Rich Chatbot

## Overview
This project was initially developed as a proof of concept for **React Server Components (RSC)** streamed components using **Vercel AI SDK v3** (also called Generative UI). It has since been updated to be loosely compatible with **Vercel AI SDK v4** and **React 19**, ensuring it remains relevant with the latest advancements in AI and React development.

The chatbot leverages the power of AI to provide rich, interactive, and dynamic conversational experiences. It demonstrates how to integrate AI capabilities into modern web applications using cutting-edge technologies.

When the chatbot is asked about a character of The Iliad, it will render a card with an illustration of the character and some information about them. This card is rendered in the server and streamed to the client.

Keep in mind that AI SDK RSC is still experimental and bugs can be found with its use: [Vercel AI SDK RSC](https://sdk.vercel.ai/docs/ai-sdk-rsc/migrating-to-ui).

## Key Features
- **Streamed Components**: Utilizes React Server Components for efficient data streaming and rendering.
- **AI Integration**: Built with Vercel AI SDK for seamless AI model integration.
- **Compatibility**: Supports both Vercel AI SDK v3 and v4, as well as React 19.

## Getting Started
To get started with this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LuisGilGB/iliad-rich-chatbot.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Resources
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs/introduction)
- [Vercel AI SDK v3 Release Post](https://vercel.com/blog/ai-sdk-3-generative-ui)
- [Vercel AI SDK v4 Release Post](https://vercel.com/blog/ai-sdk-4-0)
- [React 19 Docs](https://react.dev/)
- [React 19 Release Post](https://react.dev/blog/2024/12/05/react-19)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

- Luis Gil Gutiérrez de la Barreda

This project has been created using the Next JS Chatbot template by Vercel Labs.
