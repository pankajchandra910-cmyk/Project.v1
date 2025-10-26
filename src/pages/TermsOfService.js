import React, { useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../component/Header';
import MobileMenu from '../component/MobileMenu';
import Footer from '../component/Footer';
import { GlobalContext } from "../component/GlobalContext";

export default function TermsOfService() {
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

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("");
    navigate("/search");
  }, [navigate, setSearchQuery, setSelectedCategory]);

  const handleLogoClick = useCallback(() => {
   
      navigate(`/`);
   
  }, [navigate,]);
  const handleProfileClick = useCallback(() => {
    if (userType === "owner") {
      navigate(`/owner-dashboard/${profession}`);
    } else {
      navigate("/profile");
    }
  }, [navigate, userType, profession]);


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
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        <div className="max-w-3xl mx-auto prose lg:prose-lg bg-white p-8 rounded-lg shadow-md">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the buddyinhills.com website (the "Service") operated by Buddy In Hills ("us", "we", or "our").
          </p>
          <h2>Conditions of Use</h2>
          <p>
            We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
          </p>
          <h2>Privacy Policy</h2>
          <p>
            Before you continue using our website we advise you to read our privacy policy <a href="/privacy-policy" className="text-blue-600 hover:underline">[link to your privacy policy page]</a> regarding our user data collection. It will help you better understand our practices.
          </p>
          <h2>Copyright</h2>
          <p>
            Content published on this website (digital downloads, images, texts, graphics, logos, audio clips, video clips, data compilations, and software) is the property of Buddy In Hills and/or its content creators and protected by international copyright laws. The entire compilation of the content found on this website is the exclusive property of Buddy In Hills, with copyright authorship for this compilation by Buddy In Hills.
          </p>
          <h2>Communications</h2>
          <p>
            The entire communication with us is electronic. Every time you send us an email or visit our website, you are going to be communicating with us. You hereby consent to receive communications from us. If you subscribe to the news on our website, you are going to receive regular emails from us. We will continue to communicate with you by posting news and notices on our website and by sending you emails. You also agree that all notices, disclosures, agreements, and other communications we provide to you electronically meet the legal requirements that such communications be in writing.
          </p>
          <h2>Applicable Law</h2>
          <p>
            By visiting this website, you agree that the laws of India, without regard to principles of conflict laws, will govern these terms and conditions, or any dispute of any sort that might come between Buddy In Hills and you, or its business partners and associates.
          </p>
          <h2>Disputes</h2>
          <p>
            Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court in India and you consent to exclusive jurisdiction and venue of such courts.
          </p>
          <h2>Comments, Reviews, and Emails</h2>
          <p>
            Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property rights, invasive of privacy or injurious in any other way to third parties. Content has to be free of software viruses, political campaign, and commercial solicitation.
          </p>
          <p>
            We reserve all rights (but not the obligation) to remove and/or edit such content. When you post your content, you grant Buddy In Hills non-exclusive, royalty-free and irrevocable right to use, reproduce, publish, modify such content throughout the world in any media.
          </p>
          <h2>License and Site Access</h2>
          <p>
            We grant you a limited license to access and make personal use of this website and not to download (other than page caching) or modify it, or any portion of it, except with express written consent of Buddy In Hills.
          </p>
          <h2>User Account</h2>
          <p>
            If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and password). You are responsible for all activities that occur under your account or password.
          </p>
          <p>
            We reserve all rights to terminate accounts, edit or remove content and cancel orders in their sole discretion.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}