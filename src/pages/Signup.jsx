import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Signup() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState("password");
  const [otp, setOtp] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [form, setForm] = useState({ name: '',
     email: '',
      password: '',
       confirmPassword: '',
       phone: '',
          
          });
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchUserDetails(firebaseUser.uid);
        setIsVerified(true);
      } else {
        setUser(null);
        setIsVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setForm(snap.data());
    }
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
    });
  };

  const validateForm = () => {
  const { name, email, password, confirmPassword, phone } = form;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!name.trim()) {
    toast.error("Name is required");
    return false;
  }

  if (!emailRegex.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (!phoneRegex.test(phone)) {
    toast.error("Invalid phone number");
    return false;
  }

  if (!passwordRegex.test(password)) {
    toast.error("Password does not meet the criteria");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  return true;
};

  const handleSendOtp = async (e) => {

e.preventDefault();
 if (!validateForm()) return;
    else{
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
  
      try {
        setisLoading(true)
        const formatted = '+91' + form.phone;
        const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
        setConfirmationResult(result);
        toast.success("OTP sent successfully!");
      } catch (err) {
        toast.error("Failed to send OTP Try Again!");
        setisLoading(false)
      }
    };
    }
   




  const handleVerifyOtp = async (e) => {
    e.preventDefault();


  try {
    const res = await confirmationResult.confirm(otp);
    const currentUser = res.user;
    // Link email/password to the same user
    const credential = EmailAuthProvider.credential(form.email, form.password);
    await linkWithCredential(currentUser, credential);
    setUser(currentUser);
    setIsVerified(true);
    setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    toast.success("Registered Successfully!");
  } catch (err) {
    console.error(err);
    toast.error("OTP Verification or Register Failed");
  }
};


  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please verify your number");
    await setDoc(doc(db, 'users', user.uid), form);
    navigate('/account'); // Redirect to orders page after saving
  };

  return (
    <div className="min-h-screen p-8 bg-white-50">
      <div className="max-w-lg mx-auto bg-gray-150 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-black-500">Register</h2>
        <form action="submit">
        <div className="mb-6">
         
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2 border-gray-400 outline-gray-600"
          />
           
          
       
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-2 border-gray-400 outline-gray-600"
          />
    <div className='flex items-center justify-between pr-2 border rounded mb-2 border-gray-400 '>      <input
            name="password"
            type={showPassword}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border-0  border-gray-400 outline-0"
            
          />
          <i
  onClick={() => setShowPassword(showPassword === "password" ? "text" : "password")}
  className={showPassword === "password" ? "ri-eye-close-line cursor-pointer text-gray-500" : "ri-eye-2-line cursor-pointer text-gray-500" }
></i>
          </div>
          

          <input
            name="confirmPassword"
            type='password'
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-gray-400 outline-gray-600 passwordfield"
          />
        </div>

        {!isVerified ? (
          <>
            <div className="mb-4">
              <input
              name='phone'
                type="text"
                placeholder="Mobile Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded border-gray-400 outline-gray-600"
              />
              <button
              type='submit'
                onClick={handleSendOtp}
                className="px-2 py-1 md:px-4 md:py-2 mt-2  bg-green-700 text-white rounded hover:bg-green-800"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
              
            </div>
            
         {!confirmationResult ?
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-2/4 p-2 border rounded border-gray-400 outline-gray-600"
              />
              <button
                onClick={handleVerifyOtp}
                className="px-2 py-1 md:px-4 md:py-2 mt-2 ml-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Verify OTP
              </button>
            </div> : ""
         }
            <div id="recaptcha-container"></div>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 button1"
            >
              Login
            </button>
          </>
        )}
        </form>
        <p>Note:</p>
                                <small className="text-gray-500 text-xs">
  Password : Must be at least 8 characters, include uppercase, lowercase, and a digit
</small>

      </div>


      
      
    </div>
  );
}
