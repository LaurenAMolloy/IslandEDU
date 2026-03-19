# 🇨🇾 Island EDU App

Bridging the gap between educators and families in Cyprus.

---

## 🌍 Overview

Island EDU is a full-stack application designed to solve a real-world problem: the lack of centralized, accessible school information for families in Cyprus.

Originally adapted from a foundational full-stack project, Island EDU is now evolving into a real product, informed by direct user feedback and ongoing collaboration with schools.

---

## ✨ Mission

As a former educator in Cyprus, I experienced how fragmented school information impacts parental decision-making.

Island EDU aims to provide:
- A centralized school directory
- Clear, accessible information for families
- A scalable platform for future education services

---

## 🧠 Product Development

This project is being developed with a product-focused approach:

- **Problem Identification:** Based on real experience in education  
- **User Validation:** Conversations with parents confirmed the need for a centralized platform  
- **Real-world Integration:** Currently onboarding schools to contribute data  
- **Iterative Development:** Continuous improvements based on feedback  

---

## 🚀 Key Features

- 🔍 **School Directory**  
  Search and browse schools through a clean, responsive interface  

- 📄 **Detailed School Pages**  
  View structured information for each school  

- ⭐ **Reviews System**  
  Users can leave feedback and ratings on schools  

- 👤 **User Accounts**  
  Authentication system to support personalised interactions  

- ⚠️ **Error Handling**  
  Custom error pages and API validation for reliability  

---

## 🧱 Tech Stack

### Frontend (Server-rendered)
- EJS (Embedded JavaScript Templates)
- HTML, CSS  

### Backend
- Node.js  
- Express.js  
- RESTful API architecture  

---

## 🔗 API Routes

### Schools
| Action | Method | Route |
|--------|--------|-------|
| Index | GET | /api/schools |
| Show | GET | /api/schools/:id |
| Create | POST | /api/schools |
| Update | PUT | /api/schools/:id |
| Delete | DELETE | /api/schools/:id |

### Reviews
| Action | Method | Route |
|--------|--------|-------|
| Create | POST | /api/schools/:id/reviews |
| Delete | DELETE | /api/schools/:id/reviews/:reviewId |

### Users
| Action | Method | Route |
|--------|--------|-------|
| Register | POST | /api/register |
| Login | POST | /api/login |
| Logout | POST | /api/logout |

---
## 📁 Project Structure
```txt
.
├── app.js
├── controllers
│   ├── review.js
│   ├── schools.js
│   └── users.js
├── middleware.js
├── models
│   ├── review.js
│   ├── school.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   ├── javascripts
│   └── styles
├── routes
│   ├── reviews.js
│   ├── schools.js
│   └── users.js
├── schemas.js
├── seeds
│   ├── cities.js
│   ├── index.js
│   └── seedHelpers.js
├── uploads
│   ├── 6504635998a1b2fbecd7e32583c39a27
│   ├── a669e2735729bac2987d789bc10d0db8
│   ├── b27f91fb58f86d11f274661813213d04
│   └── b997e45f87d22d1f52c6ac8a346d75c1
├── utils
│   ├── catchAsync.js
│   └── ExpressError.js
└── views
    ├── error.ejs
    ├── home.ejs
    ├── layouts
    ├── partials
    ├── schools
    └── users
```

---

## 🚀 Future Improvements

- 🗺️ Interactive map (Google Maps integration)
- 🌐 Multi-language support (Greek & English)
- 📊 Advanced filtering and recommendations
- 🤝 School dashboard for data management

---

## 🎯 Vision

Island EDU is evolving from a technical project into a real-world platform aimed at improving access to education information across Cyprus.

---
