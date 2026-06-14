import React, { useState, useEffect } from "react";  
import {toast, ToastContainer} from "react-toastify";
import {Eye, EyeOff, Lock, Mail, LogIn} from "lucide-react"; // Import icon for login
import {BUTTON_CLASSES, INPUTWRAPPER} from "../assets/dummy";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests

const INITIAL_FORM = {email: "", password: ""}; 
const Login = ({onSubmit,onSwitchMode}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState(INITIAL_FORM);
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = React.useState(false);

    const url = "http://localhost:4000"; 

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if(token) {
            (async () => {
                try{
                    const {data} = await axios.get(`${url}/api/user/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(data.success) {
                        onSubmit?.({token, userId, ...data.user});
                        toast.success("Session restored successfully!");
                        navigate("/");
                    }
                    else {
                        localStorage.clear();
                    }
                }
                catch(error) {
                    localStorage.clear();

                }
                })();
            }
        }, [navigate, onSubmit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!rememberMe) {
            toast.error("Please check the 'Remember me' option to proceed.");
            return;
        }
        setLoading(true)

        try {
            const {data} = await axios.post(`${url}/api/user/login`, formData);
            if(!data.token) throw new Error(data.message || "Login failed. Please try again.");

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            setFormData(INITIAL_FORM);
            onSubmit?.({token:data.token, userId:data.user.id, ...data.user});
            toast.success("Login successful!");
            setTimeout(() => navigate("/"),1000);

        }

        catch(error) {
            const msg = error.response?.data?.message || error.message 
            toast.error(msg);
        }
        finally{
        setLoading(false);  
    }
} // <-- Add this closing brace for handleSubmit

const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
}

const fields = [
    {
        name: "email",
        type: "email",
        placeholder: "Email",
        icon: Mail,
    },
    {
        name: "password",
        type: showPassword ? "text" : "password",
        placeholder: "Password",
        icon: Lock,
        isPassword: true,
    },
]

return (
        <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar/>
            <div className = 'mb-6 text-center'>
                <div className="w-16 h-16 bg-gradient-to-br from bg-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className ='text-2xl font-bold text-gray-800'>Welcome Back</h2>
                <p className = 'text-gray-500 text-sm mt-1'> Sign in continue to TaskFlow</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(({name, type, placeholder, icon: Icon, isPassword}) => (
                    <div key={name} className={INPUTWRAPPER}>
                        <Icon className='text-purple-500 w-5 h-5 mr-2'/>
                        <input type={type} placeholder={placeholder} value={formData[name]} onChange={(e) => setFormData({...formData, [name]: e.target.value})}
                        className="w-full focus:outline-none text-sm text-gray-700" required/>

                        {isPassword && (
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-gray-500 hover:text-purple-500 transition-colors">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                ))}
                <div className="flex items-center">
                    <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded" required/>
                    <label  htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember me</label>
                </div>

                <button type='submit' className={BUTTON_CLASSES} disabled = {loading}>
                    {loading ? (
                        "Logging in..."
                    ):(
                        <>
                            <LogIn className="w-4 h-4" />
                            Login
                        </>
                    )}
                </button>
            </form> 

            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? {' '}
                <button onClick={handleSwitchMode} className="text-purple-500 hover:text-purple-700 hover:underline font-medium transition-colors">
                    Sign Up
                </button>
            </p>
        </div> 

    )
}
export default Login;