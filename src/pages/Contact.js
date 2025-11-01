import React, { useContext, useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// --- Global Context & Firebase ---
import { GlobalContext } from "../component/GlobalContext";
import { db, analytics } from "../firebase"; // 1. Import db and analytics
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // 2. Import Firestore functions
import { logEvent } from "firebase/analytics"; // 3. Import logEvent

// --- Component Imports ---
import Header from '../component/Header';
import MobileMenu from '../component/MobileMenu';
import Footer from '../component/Footer';

export default function Contact() {
  const navigate = useNavigate();
  const {
    setSearchQuery,
    setSelectedCategory,
    userName,
    showMobileMenu,
    setShowMobileMenu,
    userType,
    isLoggedIn,
    profession,
  } = useContext(GlobalContext);

  // 4. State for form fields and loading status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // --- Handlers from original code (unchanged) ---
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("");
    navigate("/search");
  }, [navigate, setSearchQuery, setSelectedCategory]);

  const handleLogoClick = useCallback(() => {
    navigate(`/`);
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    if (userType === "owner") {
      navigate(`/owner-dashboard/${profession}`);
    } else {
      navigate("/profile");
    }
  }, [navigate, userType, profession]);

  // --- Form input change handler ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // --- Form submission handler ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields.");
      return;
    }
    setLoading(true);

    try {
      // 5. Save the contact message to Firestore
      const contactsCollectionRef = collection(db, "contacts");
      await addDoc(contactsCollectionRef, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        submittedAt: serverTimestamp(), // Adds a server-side timestamp
        status: "New", // Default status for new inquiries
      });

      // 6. Log the 'generate_lead' event to Firebase Analytics
      if (analytics) {
        logEvent(analytics, 'generate_lead', {
          value: 1, // You can assign a value to a lead if applicable
          currency: 'INR',
        });
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onProfileClick={handleProfileClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />

      {showMobileMenu && (
        <MobileMenu
          onClose={() => setShowMobileMenu(false)}
          userType={userType}
          profession={profession}
        />
      )}

      <main className="grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-lg text-center max-w-2xl mx-auto mb-6">
          Have questions or need assistance? Reach out to us!
        </p>
        <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          {/* --- Contact Info section is unchanged --- */}
          <p className="text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email: <a href="mailto:buddyinhillss@gmail.com" className="text-blue-600 hover:underline ml-2">buddyinhillss@gmail.com</a>
          </p>
          <p className="text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Phone: <a href="tel:+919105706377" className="text-blue-600 hover:underline ml-2">+91 9105706377</a>
          </p>
          <p className="text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Address: Nainital, Uttarakhand, India
          </p>
        </div>
        <div className="mt-10 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Send Us a Message</h2>
          {/* 7. Connect form to the submission handler */}
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              disabled={loading} // Disable button while submitting
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}