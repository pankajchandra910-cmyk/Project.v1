import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Linkedin, Twitter } from "lucide-react"; // Import social icons

export default function Footer() {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" }, // Corrected path
    { name: "Terms of Service", path: "/terms" }, // Corrected path
  ];

  const destinations = [
    { name: "Nainital", path: "/location-details/nainital" },
    { name: "Bhimtal", path: "/location-details/bhimtal" },
    { name: "Sukhatal", path: "/location-details/sukhatal" },
    { name: "Naukuchiatal", path: "/location-details/naukuchiatal" },
  ];

  // Fixed social media and email links
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/buddyinhills/", // Replace with your actual Instagram link
    },
    {
      name: "Linkedin",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/buddyinhills007/", // Replace with your actual LinkedIn link
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      url: "https://x.com/BuddyInHills", // Replace with your actual X link
    },
  ];

  const emailLink = "mailto:buddyinhillss@gmail.com"; // Direct email link

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Buddy In Hills</h3>
            <p className="text-gray-400">
              Your gateway to exploring the beautiful lakes and mountains of Uttarakhand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-gray-400">
              {destinations.map((destination) => (
                <li key={destination.name}>
                  <Link to={destination.path} className="hover:text-white transition-colors">
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400 mb-4"> {/* Added mb-4 for spacing */}
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 9105706377</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>buddyinhillss@gmail.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
              {/* Email Icon */}
              <a
                href={emailLink}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email Us"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Buddy In Hills. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}