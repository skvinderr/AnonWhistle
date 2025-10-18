# 🛡️ AnonWhistle - Anonymous Corruption Reporting Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🌟 Overview

**AnonWhistle** is a revolutionary blockchain-powered platform that enables anonymous reporting of corruption and misconduct. Built with cutting-edge AI technology, it provides a secure, transparent, and efficient system for citizens to report issues while protecting their identity and ensuring accountability.

## ✨ Key Features

### 🔒 **Anonymous Reporting System**
- **Wallet-based Authentication**: Secure identity protection using blockchain technology
- **Zero-Knowledge Architecture**: Report without revealing personal information
- **End-to-End Encryption**: All communications are encrypted and secure
- **Anonymous Evidence Upload**: Submit documents, images, and audio safely

### 🤖 **AI-Powered Features**

#### **AI Voice Complaint Registration**
- **Speech-to-Text Technology**: Convert spoken complaints to structured reports
- **Real-time Audio Monitoring**: Advanced voice detection with WebAudio API
- **Gemini AI Integration**: Intelligent complaint analysis and categorization
- **Multi-language Support**: Process complaints in various languages

#### **Deepfake & Forgery Detection**
- **Microsoft Video Authenticator**: Professional-grade video verification
- **Deepware Scanner**: Advanced deepfake detection algorithms
- **FaceForensics++**: Academic-level manipulation detection
- **Metadata Analysis**: Comprehensive file integrity verification
- **Multi-Engine Validation**: Cross-reference multiple AI models for accuracy

### 📊 **Comprehensive Dashboard Systems**

#### **Citizen Dashboard**
- **Complaint Tracking**: Real-time progress monitoring
- **Evidence Management**: Secure file upload and organization
- **Voice Assistant Integration**: AI-powered complaint assistance
- **Progress Timeline**: Detailed case progression tracking

#### **Officials Dashboard**
- **Case Management**: Advanced filtering and sorting capabilities
- **AI Evidence Verification**: Integrated deepfake detection tools
- **Analytics & Reporting**: Comprehensive performance metrics
- **Department Management**: Multi-level administrative controls

### 🚨 **Emergency Features**
- **Panic Button**: Discrete emergency assistance (2-second hold activation)
- **Weather Redirect**: Disguised emergency protocol for safety
- **Location Tracking**: GPS-based emergency response
- **Emergency Contacts**: Automatic alert system

### 🔍 **Advanced Analytics**
- **Complaint Trends**: Data visualization and pattern recognition
- **Department Performance**: Efficiency and resolution tracking
- **Geographic Mapping**: Location-based incident analysis
- **Predictive Analytics**: AI-powered trend forecasting

## 🏗️ Architecture

### **Frontend Stack**
```
├── Next.js 15.5.5 (App Router)
├── React 18+ with Hooks
├── Tailwind CSS (Responsive Design)
├── React Icons (UI Components)
├── Web Speech API (Voice Recognition)
├── WebAudio API (Audio Processing)
└── Google Generative AI (Gemini 2.5 Flash)
```

### **Backend Integration**
```
├── Node.js Express Server
├── MongoDB Database
├── Blockchain Integration
├── File Storage System
└── AI Model APIs
```

### **AI & ML Services**
```
├── Google Gemini AI (Text Analysis)
├── Microsoft Video Authenticator
├── Deepware Scanner API
├── FaceForensics++ Models
└── Custom Audio Processing
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/skvinderr/AnonWhistle.git
cd AnonWhistle
```

2. **Install Dependencies**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. **Environment Setup**
```bash
# Create .env.local in client directory
cd client
cp .env.example .env.local
```

4. **Configure Environment Variables**
```env
# Google AI API Key (for Gemini)
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_api_key_here

# Other API Keys
NEXT_PUBLIC_DEEPWARE_API_KEY=your_deepware_key
NEXT_PUBLIC_VIDEO_AUTH_API_KEY=your_video_auth_key
```

5. **Run Development Servers**
```bash
# Frontend (Port 3000)
cd client
npm run dev

# Backend (Port 5000)
cd ../server
npm run dev
```

6. **Access the Application**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 📁 Project Structure

```
AnonWhistle/
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router Pages
│   │   │   ├── dashboard/           # Citizen Dashboard
│   │   │   ├── officials-dashboard/ # Officials Interface
│   │   │   ├── ai-voice-complaint/  # AI Voice System
│   │   │   ├── complaint-progress/  # Progress Tracking
│   │   │   ├── my-complaints/       # Complaint Management
│   │   │   └── new-complaint/       # Complaint Submission
│   │   ├── components/              # Reusable Components
│   │   │   ├── Charts.js           # Analytics Components
│   │   │   ├── FloatingPanicButton.js # Emergency Feature
│   │   │   └── ...                 # Other UI Components
│   │   └── utils/                  # Utility Functions
│   ├── public/                     # Static Assets
│   └── package.json               # Dependencies
├── server/                         # Backend API
│   ├── models/                    # Database Models
│   ├── routes/                    # API Routes
│   ├── config/                    # Configuration
│   └── server.js                  # Express Server
├── contract/                      # Smart Contracts
│   └── RegisterComplaint.sol     # Blockchain Contract
└── README.md                      # Documentation
```

## 🔐 Security Features

### **Data Protection**
- **End-to-End Encryption**: All sensitive data encrypted in transit and at rest
- **Zero-Knowledge Proofs**: Mathematical verification without data exposure
- **Blockchain Immutability**: Tamper-proof record keeping
- **Secure File Handling**: Advanced malware and forgery detection

### **Privacy Protection**
- **Anonymous Wallets**: No personal information linked to reports
- **IP Masking**: Location privacy protection
- **Metadata Scrubbing**: Automatic removal of identifying information
- **Secure Communication**: Encrypted messaging system

### **AI Security**
- **Multi-Model Validation**: Cross-verification using multiple AI systems
- **Confidence Scoring**: Probabilistic authenticity assessment
- **Adversarial Detection**: Protection against AI manipulation attempts
- **Audit Trail**: Complete analysis history and transparency

## 🎨 User Interface

### **Design Philosophy**
- **Dark Theme**: Professional and secure appearance
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Intuitive Navigation**: User-centered design principles

### **Key UI Components**
- **Voice Interface**: Natural language interaction
- **Progress Tracking**: Visual timeline components
- **File Upload**: Drag-and-drop with progress indicators
- **Emergency Features**: Discrete panic button integration

## 🧪 AI Features Deep Dive

### **Voice Complaint System**
```javascript
Features:
├── Continuous Speech Recognition
├── Real-time Audio Level Monitoring
├── Noise Cancellation & Enhancement
├── Multi-language Support
├── Gemini AI Analysis Pipeline
└── Structured Report Generation
```

### **Evidence Verification Pipeline**
```javascript
Analysis Steps:
├── File Type Detection
├── Metadata Extraction
├── Technical Analysis
│   ├── Compression Artifacts
│   ├── Pixel Consistency
│   └── Noise Patterns
├── AI Model Processing
│   ├── Deepfake Detection
│   ├── Manipulation Analysis
│   └── Authenticity Scoring
└── Report Generation
```

## 📊 Analytics & Insights

### **Metrics Tracked**
- **Complaint Volume**: Trends and patterns
- **Resolution Time**: Department efficiency
- **Geographic Distribution**: Hotspot identification
- **Category Analysis**: Issue type classification
- **Success Rates**: Resolution effectiveness

### **Visualization Tools**
- **Interactive Charts**: Real-time data visualization
- **Heatmaps**: Geographic incident mapping
- **Trend Analysis**: Historical pattern recognition
- **Performance Dashboards**: KPI monitoring

## 🛠️ Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation

# Testing
npm run test         # Run test suite
npm run test:watch   # Watch mode testing
npm run e2e          # End-to-end testing

# Deployment
npm run deploy       # Deploy to production
npm run analyze      # Bundle analysis
```

### **Code Quality**
- **ESLint**: Code style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality gates

## 🌍 Deployment

### **Production Deployment**

1. **Build Optimization**
```bash
npm run build
npm run analyze  # Check bundle size
```

2. **Environment Configuration**
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=your_production_db
JWT_SECRET=your_jwt_secret
AI_API_KEYS=your_production_keys
```

3. **Platform Deployment**
- **Vercel** (Recommended for frontend)
- **Railway/Render** (Backend deployment)
- **AWS/GCP** (Enterprise deployment)

### **Performance Optimization**
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js automatic optimization
- **Caching**: Aggressive caching strategies
- **CDN**: Global content distribution

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

## 📝 API Documentation

### **Core Endpoints**

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session

// Complaints
GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id
DELETE /api/complaints/:id

// AI Services
POST /api/ai/analyze-voice
POST /api/ai/verify-evidence
GET  /api/ai/analysis-history

// Analytics
GET /api/analytics/dashboard
GET /api/analytics/trends
GET /api/analytics/departments
```

## 🔍 Troubleshooting

### **Common Issues**

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**API Connection Issues**
```bash
# Check environment variables
cat .env.local
# Verify API keys are valid
npm run test:api
```

**Voice Recognition Problems**
```bash
# Enable microphone permissions
# Check browser compatibility
# Verify HTTPS connection
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI Team** - Gemini API integration
- **Microsoft** - Video Authenticator technology
- **Deepware** - Deepfake detection algorithms
- **Next.js Team** - Amazing framework and tools
- **Tailwind CSS** - Beautiful styling system
- **Open Source Community** - Inspiration and contributions

## 📞 Support & Contact

- **Documentation**: [Wiki](https://github.com/skvinderr/AnonWhistle/wiki)
- **Issues**: [GitHub Issues](https://github.com/skvinderr/AnonWhistle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/skvinderr/AnonWhistle/discussions)
- **Security**: security@anonwhistle.org

## 🎯 Roadmap

### **Phase 1 - Foundation** ✅
- [x] Core complaint system
- [x] Anonymous reporting
- [x] Basic dashboard

### **Phase 2 - AI Integration** ✅
- [x] Voice complaint system
- [x] Deepfake detection
- [x] Evidence verification

### **Phase 3 - Advanced Features** 🔄
- [ ] Blockchain integration
- [ ] Advanced analytics
- [ ] Mobile applications

### **Phase 4 - Scale** 📋
- [ ] Multi-language support
- [ ] Government partnerships
- [ ] Global deployment

---

<div align="center">

**Built with ❤️ for transparency and accountability**

[⭐ Star this repo](https://github.com/skvinderr/AnonWhistle) | [🐛 Report Bug](https://github.com/skvinderr/AnonWhistle/issues) | [💡 Request Feature](https://github.com/skvinderr/AnonWhistle/issues)

</div>
