# Biv'Quack

Welcome to **Biv'Quack**, a modern and dynamic React Native application designed for seamless experiences with maps, translations, and advanced search filtering.
A perfect solution for travelers and explorers, Biv'Quack allows users to find and filter campsites based on their preferences and location.
Host can rent their land and campers can find the perfect spot to set up their tent.

---

## 🚀 Features

- **Interactive Map Integration**:
    - Powered by `react-native-maps` for smooth navigation and marker customization.
    - User's current location detection using `expo-location`.

- **Multi-Language Support**:
    - Built with `i18next` and `react-i18next` for real-time translation switching.
    - Includes English (`en`) and French (`fr`) locales.

- **Dynamic Search Filters**:
    - Filter map markers based on amenities and capacities.
    - Search by city name with geocoding powered by `react-native-geocoding`.

- **Redux State Management**:
    - Global state management with `@reduxjs/toolkit` and `react-redux`.
    - Language preferences and user settings are persistently stored.

- **Custom UI Components**:
    - Modular components for filters, markers, and user interactions.

- **Unit Testing**:
    - `Jest` and `@testing-library/react-native` for robust testing.
    - Test coverage reports available.

---

## 📁 Project Structure

The project is structured as follows:
```
📁 stickersmash/
├── App.tsx                       # Entry point of the application
├── assets/                       # Contains images, fonts, and other static assets
│   ├── images/
│   ├── fonts/
│   └── data/
├── components/                   # Modular React Native components
│   └── map/                      # Components related to map functionality
├── controllers/                  # Logic abstraction for map and user operations
├── locales/                      # Language files (e.g., `en.json`, `fr.json`)
├── models/                       # TypeScript models for data structures
├── features/                     # Redux slices and state management logic
├── __tests__/                    # Unit test files
├── coverage/                     # Test coverage reports
├── node_modules/                 # Dependencies
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── .env                          # Environment variables (e.g., API keys)
   ```
---
## 🛠️ Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/stickersmash.git
   cd stickersmash
    ```
2. **Install Dependencies**:
    ```bash
    yarn install
     ```
3. **Environment Variables:**:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```env
        EXPO_PUBLIC_GOOGLE_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
        EXPO_PUBLIC_API_URL=http://localhost:8090/api/v1
        EXPO_PUBLIC_ENV=development

        ```
      
4. **Run the Application**:
   ```bash
   yarn start
   ```
   
## 🧪 Testing

```bash    
yarn test 
```

## ✨Technologies Used
	
-	Frontend: React Native, Expo
-	State Management: Redux Toolkit
-	Testing: Jest, React Testing Library
-	Localization: i18next, react-i18next
-	Maps: react-native-maps, react-native-geocoding
-	Styling: Tailwind CSS (via nativewind)
