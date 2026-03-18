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

### Frontend
- React.js  
- React Router  
- Tailwind CSS  

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

## 🚀 Future Improvements

- 🗺️ Interactive map (Google Maps integration)
- 🌐 Multi-language support (Greek & English)
- 📊 Advanced filtering and recommendations
- 🤝 School dashboard for data management

---

## 🎯 Vision

Island EDU is evolving from a technical project into a real-world platform aimed at improving access to education information across Cyprus.

---
