import React, { useContext, useCallback, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Edit, Star, Save, X, Loader2 } from 'lucide-react';
import { Button } from '../component/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../component/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '../component/Card';
import { Badge } from '../component/badge';
import Header from '../component/Header';
import MobileMenu from "../component/MobileMenu";
import AIchat from '../component/AIchat';
import CabBookingModal from '../component/CabBookingModal'; // Assuming this component exists
import { GlobalContext } from '../component/GlobalContext';
import { toast } from 'sonner';
import { auth } from '../firebase';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updateProfile,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../component/dialog';
import { Input } from '../component/Input';
import { Label } from '../component/label';

export default function ProfileView() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoggedIn, userName, setUserName, userPhone, setUserPhone, userEmail, setUserEmail,
    loginPlatform, userType, showMobileMenu, setShowMobileMenu, showAIChat, setShowAIChat,
    language, userVisitedPlaces, userRecentBookings, userSavedPlaces,
    updateUserProfileInFirestore, userPhoneVerified,
  } = useContext(GlobalContext);

  // --- LOCAL STATE ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [isNameSaving, setIsNameSaving] = useState(false);

  // Email Reauthentication/Change Modals
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthNewEmail, setReauthNewEmail] = useState("");
  const [reauthLoading, setReauthLoading] = useState(false);

  // Add Email Modal for Phone-only users
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState("");
  const [addEmailLoading, setAddEmailLoading] = useState(false);

  // Phone Verification Modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(userPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Assuming CabBookingModal needs a state to control its visibility
  const [showCabBooking, setShowCabBooking] = useState(false);

  // Sync local state with global context changes
  useEffect(() => { setNewName(userName); }, [userName]);
  useEffect(() => { setPhoneToVerify(userPhone || ""); }, [userPhone]);
  useEffect(() => { setEmailToAdd(userEmail || ""); }, [userEmail]); // Sync email for add email modal

  // Check for URL query params to trigger modals (e.g., for phone verification after signup)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verifyPhone') === '1' && !userPhoneVerified) {
      setPhoneToVerify(userPhone || '');
      setShowPhoneModal(true);
    }
  }, [location.search, userPhone, userPhoneVerified]);

  // --- HANDLERS ---

  /**
   * Handles saving the new user name to Firebase Auth and Firestore.
   */
  const handleSaveName = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (newName.trim() === userName) {
      setIsEditingName(false);
      return;
    }

    setIsNameSaving(true);
    try {
      // First, update the Firestore document
      const firestoreSuccess = await updateUserProfileInFirestore({ displayName: newName.trim() });

      if (firestoreSuccess && auth.currentUser) {
        // If Firestore update is successful, update the Firebase Auth profile
        await updateProfile(auth.currentUser, { displayName: newName.trim() });
      } else if (!firestoreSuccess) {
        throw new Error("Failed to save profile to database.");
      }

      // Update global context for immediate UI feedback (will also be updated on next fetch)
      setUserName(newName.trim());
      toast.success('Name updated successfully!');
      setIsEditingName(false);
    } catch (error) {
      // console.error("Error updating name:", error);
      toast.error('Failed to update name: ' + error.message);
    } finally {
      setIsNameSaving(false);
    }
  };

  const handleCancelEditName = () => {
    setNewName(userName); // Revert to original name
    setIsEditingName(false);
  };

  /**
   * Handles sending OTP for phone number verification.
   */
  const handleSendPhoneOTP = async () => {
    // Basic validation for phone number format
    if (!phoneToVerify || !phoneToVerify.match(/^\+\d{10,15}$/)) {
      return toast.error('Please enter a valid phone number including country code (e.g., +911234567890).');
    }
    setPhoneLoading(true);
    try {
      // signInWithPhoneNumber acts as the OTP sender for linking
      const confirmationResult = await signInWithPhoneNumber(auth, phoneToVerify);
      setPhoneConfirmationResult(confirmationResult);
      setPhoneOtpSent(true);
      toast.success('OTP sent to ' + phoneToVerify);
    } catch (e) {
      // console.error("Error sending OTP:", e);
      toast.error('Failed to send OTP: ' + (e.message || e.code));
    } finally {
      setPhoneLoading(false);
    }
  };

  /**
   * Handles confirming OTP for phone number verification and linking.
   */
  const handleConfirmPhoneOTP = async () => {
    if (!phoneConfirmationResult || !phoneOtp) {
      return toast.error('Please enter the OTP.');
    }
    setPhoneLoading(true);
    try {
      // Create a PhoneAuthCredential using the verification ID and OTP
      const phoneCred = PhoneAuthProvider.credential(phoneConfirmationResult.verificationId, phoneOtp);
      // Link the phone number credential to the currently logged-in user
      await linkWithCredential(auth.currentUser, phoneCred);

      // Update phone number and verified status in Firestore
      await updateUserProfileInFirestore({ phoneNumber: phoneToVerify, phoneVerified: true });

      // Update global context
      setUserPhone(phoneToVerify);
      toast.success('Phone number verified and linked!');
      setShowPhoneModal(false);
      // Reset phone state
      setPhoneOtp("");
      setPhoneConfirmationResult(null);
      setPhoneOtpSent(false);
    } catch (e) {
      // console.error("Error verifying OTP:", e);
      toast.error('Failed to verify OTP: ' + (e.message || e.code));
    } finally {
      setPhoneLoading(false);
    }
  };

  /**
   * Determines which email-related action to take based on login platform and existing email.
   */
  const handleEmailAction = () => {
    if (loginPlatform === 'Email') {
      // If logged in with email, allow changing email via reauthentication
      setReauthNewEmail(userEmail); // Pre-fill with current email
      setShowReauthModal(true);
    } else if (loginPlatform === 'Phone' && !userEmail) {
      // If logged in with phone and no email, allow adding an email
      setShowAddEmailModal(true);
    } else {
      // For Google/other providers, email is managed by them
      toast.info("Your email is managed by your login provider (e.g., Google) and cannot be changed directly here.");
    }
  };

  /**
   * Performs reauthentication and updates the user's email address.
   */
  const performReauthAndChangeEmail = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error('No user is logged in.');
    if (!reauthPassword) return toast.error('Please enter your password.');
    if (!reauthNewEmail || !reauthNewEmail.includes('@')) return toast.error('Please enter a valid new email address.');

    setReauthLoading(true);
    try {
      // Reauthenticate the user with their current email and password
      const cred = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, cred);

      // Update email in Firebase Auth
      await updateEmail(user, reauthNewEmail);

      // Update email in Firestore
      await updateUserProfileInFirestore({ email: reauthNewEmail });

      // Update global context
      setUserEmail(reauthNewEmail);
      toast.success('Authentication email updated successfully.');
      setShowReauthModal(false);
    } catch (e) {
      // console.error("Error changing email:", e);
      toast.error('Failed to update email: ' + (e.message || e.code));
    } finally {
      setReauthLoading(false);
      setReauthPassword(''); // Clear password field
    }
  };

  /**
   * Handles adding an email address for phone-only users, sending a verification link.
   */
  const handleAddEmailForPhoneUser = async () => {
    if (!emailToAdd || !emailToAdd.includes('@')) return toast.error("Please enter a valid email address.");
    setAddEmailLoading(true);
    try {
      // This sends a verification link to the new email. The actual email update
      // happens when the user clicks the link in their inbox.
      await verifyBeforeUpdateEmail(auth.currentUser, emailToAdd);

      // We save to DB preemptively; the Firebase Auth email field will update
      // only after verification. A global context refresh will pick it up.
      await updateUserProfileInFirestore({ email: emailToAdd });
      toast.success("Verification email sent!", "Check your inbox to confirm your new email address.");
      setShowAddEmailModal(false);
      setEmailToAdd(""); // Clear the input
    } catch (error) {
      // console.error("Error adding email:", error);
      toast.error("Failed to send verification email: " + (error.message || error.code));
    } finally {
      setAddEmailLoading(false);
    }
  };

  // Memoized callback for search navigation
  const handleSearch = useCallback((query) => navigate(`/search?q=${query}`), [navigate]);
  // Memoized callback for logo click navigation based on user type
  const handleLogoClick = useCallback(() => navigate(userType === "owner" ? "/owner-dashboard" : "/"), [navigate, userType]);

  // If user is not logged in, display a prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center max-w-sm mx-auto">
          <CardTitle className="mb-4">Please Log In</CardTitle>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} />}

      <main className="container mx-auto px-4 py-8 space-y-8 lg:space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-muted-foreground text-base">Manage your travel preferences and bookings</p>
          </div>
          <Button onClick={() => setShowAIChat(true)} className="bg-secondary px-6 py-3 rounded-lg text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />Ask AI
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 sm:grid-cols-5 md:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="viewpoints">Viewpoints</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Profile Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Welcome, {userName}! Manage your account information below.</p>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="profile-name">Name</Label>
                    <div className="flex items-center gap-2 p-2 mt-1 bg-gray-50 rounded-lg border">
                      <Input
                        id="profile-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="grow bg-transparent border-0 outline-none focus:ring-0 read-only:bg-gray-50 read-only:cursor-default"
                        readOnly={!isEditingName}
                      />
                      {isEditingName ? (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveName} disabled={isNameSaving}>
                            {isNameSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelEditName} disabled={isNameSaving}>
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingName(true)}>
                          <Edit className="w-4 h-4 text-gray-600" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <div className="flex items-center justify-between p-3 mt-1 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900">{userPhone || 'Not provided'}</span>
                        <Badge variant={userPhoneVerified ? "secondary" : "destructive"}>
                          {userPhoneVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <Button variant="link" size="sm" onClick={() => setShowPhoneModal(true)}>
                        {userPhoneVerified ? 'Change' : 'Verify'}
                      </Button>
                    </div>
                  </div>

                  {/* Email Address Field */}
                  <div>
                    <Label htmlFor="profile-email">Email Address</Label>
                    <div className="flex items-center justify-between p-3 mt-1 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{userEmail || 'Not Provided'}</span>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleEmailAction}
                        // Disable if logged in via Google or if phone user already has an email (they'd use change)
                        disabled={loginPlatform === 'Google'}
                      >
                        {loginPlatform === 'Phone' && !userEmail ? 'Add Email' : 'Change'}
                      </Button>
                    </div>
                  </div>

                  {/* Login Method Field */}
                  <div>
                    <Label>Login Method</Label>
                    <div className="flex items-center justify-between p-3 mt-1 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-blue-700 font-medium">Logged in via {loginPlatform}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 text-xs">
                        {userType === 'user' ? 'User' : 'Owner'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visited Places Card */}
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6"><CardTitle className="text-2xl font-semibold text-gray-800">Visited Places</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-3">
                  {userVisitedPlaces && userVisitedPlaces.length > 0 ? (
                    userVisitedPlaces.map((place) => (
                      <Badge
                        key={place.id}
                        variant={place.status === 'visited' ? 'secondary' : 'outline'}
                        className={`px-4 py-2 text-sm rounded-full ${place.status === 'visited' ? 'bg-green-100 text-green-800' : 'border-gray-300 text-gray-600'}`}
                      >
                        {place.name} {place.status === 'visited' && '✓'}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No places visited yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab Content */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6"><CardTitle className="text-2xl font-semibold text-gray-800">Recent Bookings</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {userRecentBookings && userRecentBookings.length > 0 ? (
                    userRecentBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <h4 className="font-medium text-lg text-gray-800">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{booking.dates}</p>
                        </div>
                        <Badge
                          className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-semibold rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No recent bookings.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab Content */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6"><CardTitle className="text-2xl font-semibold text-gray-800">Saved Places</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSavedPlaces && userSavedPlaces.length > 0 ? (
                    userSavedPlaces.map((place) => (
                      <div key={place.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-lg text-gray-800">{place.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{place.location}</p>
                        <div className="flex items-center space-x-1 mt-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{place.rating}</span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/${place.type}-details/${place.id}`)}>
                          View Details
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-muted-foreground italic">No saved places yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Add content for "Viewpoints" and "Routes" tabs here if needed */}
          <TabsContent value="viewpoints">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6"><CardTitle className="text-2xl font-semibold text-gray-800">Your Viewpoints</CardTitle></CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground italic">Content for user's viewpoints will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="routes">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6"><CardTitle className="text-2xl font-semibold text-gray-800">Your Saved Routes</CardTitle></CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground italic">Content for user's saved routes will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Chat Modal */}
      <AIchat isOpen={showAIChat} onClose={() => setShowAIChat(false)} language={language} />

      {/* Cab Booking Modal (assuming it's a general purpose modal) */}
      <CabBookingModal isOpen={showCabBooking} onClose={() => setShowCabBooking(false)} />

      {/* Phone Verification Modal */}
      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>{phoneOtpSent ? "Enter the 6-digit code we sent to your phone." : "We will send an OTP to this number for verification."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!phoneOtpSent ? (
              <div>
                <Label htmlFor="phone-verify">Phone Number</Label>
                <Input
                  id="phone-verify"
                  value={phoneToVerify}
                  onChange={(e) => setPhoneToVerify(e.target.value)}
                  placeholder="+911234567890"
                  type="tel"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="otp-verify">Enter OTP</Label>
                <Input
                  id="otp-verify"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="123456"
                  type="text"
                  maxLength="6"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneModal(false)}>Cancel</Button>
            {!phoneOtpSent ? (
              <Button onClick={handleSendPhoneOTP} disabled={phoneLoading}>
                {phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}
              </Button>
            ) : (
              <Button onClick={handleConfirmPhoneOTP} disabled={phoneLoading}>
                {phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Link'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reauthentication Modal for Email Change (for Email/Password users) */}
      <Dialog open={showReauthModal} onOpenChange={setShowReauthModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Identity & Change Email</DialogTitle>
            <DialogDescription>For your security, please enter your current password to change your email address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reauth-new-email">New Email Address</Label>
              <Input
                id="reauth-new-email"
                type="email"
                value={reauthNewEmail}
                onChange={(e) => setReauthNewEmail(e.target.value)}
                placeholder="new@example.com"
              />
            </div>
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReauthModal(false)}>Cancel</Button>
            <Button onClick={performReauthAndChangeEmail} disabled={reauthLoading}>
              {reauthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm & Update Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Email Modal (for Phone users without email) */}
      <Dialog open={showAddEmailModal} onOpenChange={setShowAddEmailModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Email Address</DialogTitle>
            <DialogDescription>A verification link will be sent to the provided email to confirm its ownership.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="email-to-add">Email Address</Label>
            <Input
              id="email-to-add"
              type="email"
              value={emailToAdd}
              onChange={(e) => setEmailToAdd(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEmailModal(false)}>Cancel</Button>
            <Button onClick={handleAddEmailForPhoneUser} disabled={addEmailLoading}>
              {addEmailLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Verification Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}