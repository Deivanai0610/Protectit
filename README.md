Protectit/                          # Root folder (create this)
├── App.js                          # Main app entry (navigation)
├── app.json                        # Expo configuration
├── package.json                    # App dependencies and scripts
├── .gitignore                      # Git ignore rules (optional, but recommended)
├── assets/                         # Optional: For icons/splash (create if you want custom images)
│   ├── icon.png               # App icon (download a shield/lock PNG from Flaticon.com, 1024x1024)
│   ├── splash.png                  # Splash screen image (optional, 1242x2436 PNG)
│   └── adaptive-icon.png           # Android adaptive icon (optional, 108x108 PNG)
├── screens/                        # App screens (create this folder)
│   ├── PhishingChecker.js          # Phishing link analysis screen
│   ├── History.js                  # History of checks screen
│   ├── Quiz.js                     # Phishing quiz screen
│   └── PrivacySummarizer.js        # Privacy policy summary screen
└── backend/                        # Backend for database (create this folder - separate from app)
    ├── index.js                    # Express server
    ├── db.js                       # Database connection
    ├── package.json                # Backend dependencies
    ├── .env                        # Secrets (DB URL - keep private!)
    └── .gitignore                  # Backend git ignore