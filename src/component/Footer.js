import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Linkedin, Twitter, MapPin } from "lucide-react";

export default function Footer() {
  // --- DATA CONFIGURATION ---
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const destinations = [
    { name: "Nainital", path: "/location-details/nainital" },
    { name: "Bhimtal", path: "/location-details/bhimtal" },
    { name: "Sukhatal", path: "/location-details/sukhatal" },
    { name: "Naukuchiatal", path: "/location-details/naukuchiatal" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/buddyinhills/" },
    { name: "Linkedin", icon: Linkedin, url: "https://www.linkedin.com/in/buddyinhills007/" },
    { name: "X (Twitter)", icon: Twitter, url: "https://x.com/BuddyInHills" },
  ];

  const emailLink = "mailto:buddyinhillss@gmail.com";

  const gmapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27864.42521954313!2d79.43257833019848!3d29.38473391757303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0a1bc28fd9d61%3A0x7cae7ba924398993!2sNainital%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1675402527285!5m2!1sen!2sin";
  const gmapUrl = "https://www.google.com/maps/place/Nainital,+Uttarakhand";

  // --- JSX STRUCTURE ---
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Responsive 5-Column Grid for large screens, 3 for medium, 1 for small */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Column 1: Brand & Social */}
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Buddy In Hills</h3>
            <p className="text-gray-400 mb-6">
              Your gateway to exploring the beautiful lakes and mountains of Uttarakhand.
            </p>
            <h4 className="font-semibold text-base mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-200"
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

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h4 className="font-semibold text-base mb-4">Destinations</h4>
            <ul className="space-y-3 text-gray-400">
              {destinations.map((destination) => (
                <li key={destination.name}>
                  <Link to={destination.path} className="hover:text-white transition-colors duration-200">
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 shrink-0" />
                <a href="tel:+919105706377" className="hover:text-white transition-colors duration-200">
                  +91 9105706377
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 shrink-0" />
                <a href="mailto:buddyinhillss@gmail.com" className="hover:text-white transition-colors duration-200">
                  buddyinhillss@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 shrink-0 mt-1" />
                <span>Nainital, Uttarakhand, India</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Location Map */}
          <div>
            <h4 className="font-semibold text-base mb-4">Our Location</h4>
            <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
               <a href={gmapUrl} target="_blank" rel="noopener noreferrer" aria-label="View our location on Google Maps">
                  <iframe
                    src={gmapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map of Nainital"
                    className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                  ></iframe>
                </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Buddy In Hills. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}