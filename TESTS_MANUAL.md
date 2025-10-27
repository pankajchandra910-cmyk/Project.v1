Manual Test Checklist for Profile auth flows

1) Name change -> Auth + Firestore
- Steps:
  - Log in with Email/Password or Google (non-anonymous).
  - Go to Profile page.
  - Click Edit on Name, change and Save.
- Expected:
  - UI reflects new name immediately.
  - Firebase Auth currentUser.displayName updated (check in console or Firebase Auth users list).
  - Firestore `/users/{uid}` has `displayName` or equivalent updated.

2) Email change -> Reauth + Auth + Firestore
- Steps:
  - Log in with Email/Password.
  - Go to Profile page.
  - Click Edit on Email, enter new email, choose OK to change auth email when prompted.
  - In the Reauthentication modal, enter current password and Confirm.
- Expected:
  - After successful reauth, Firebase Auth `email` is updated.
  - Firestore `/users/{uid}` `email` field updated.
  - UI `userEmail` updates immediately.
- Notes:
  - If password is incorrect, operation should fail with toast explaining the error.
  - If user signed in with Google/Phone, reauth flow will require a different method (not password).

3) Phone change -> Firestore (profile only) or Full reverify flow
- Steps (Full verify):
  - While on Profile page, click Edit on Phone and set desired phone (include country code, e.g., `+911234567890`).
  - Click Save; the Phone Verification modal appears.
  - Click Send OTP. (reCAPTCHA will run invisibly.)
  - Enter received OTP and click Verify & Link.
- Expected (Full verify):
  - After successful OTP verification, the phone credential is linked to the Firebase Auth user.
  - Firestore `/users/{uid}` `phoneNumber` is updated.
  - UI `userPhone` updates immediately.
- Steps (Profile-only):
  - When editing phone, if you choose not to run verification, the app will still update the Firestore profile when Save is used (but auth.phoneNumber remains unchanged).
- Notes:
  - Phone linking requires reCAPTCHA support and valid phone numbers.
  - If reCAPTCHA fails or phone provider disabled, the UI should show a helpful error.

4) Guest / Anonymous notes
- Ensure Anonymous sign-in is enabled in Firebase Console (Authentication -> Sign-in method -> Anonymous).
- If anonymous is disabled, guest sign-in will fail with `auth/operation-not-allowed`.

5) Owner listings remote sync
- Manual sync and auto-sync behavior should be tested separately (see OwnerDashboard).

How to view raw Firebase errors (for debugging):
- Open browser DevTools Console; look for warnings or errors that include `auth/` or `permission-denied` codes.
- Bring those error.code values to the developer for exact next steps.

Quick commands to run dev server (Windows cmd.exe):
```cmd
npm install
npm start
```

If you'd like, I can add automated tests (Jest + firebase-mock) for some of these flows; note that phone linking and reCAPTCHA are harder to automate and usually require integration/e2e testing with a real project or emulator.