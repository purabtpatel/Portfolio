

// ContactForm.jsx
import { useState } from "react";
import "./ContactPage.css"; // Assuming you have a CSS file for styling
import AboutContactsComponent from "../AboutPage/AboutContactsComponent/AboutContactsComponent";

function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setStatus(data.message);
    };

    return (
        <div className="contactPage">
            <div className="contactHeader">
                <AboutContactsComponent />
            </div>
            
            <div className="contactForm">
                <form onSubmit={handleSubmit} className="form">
                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="textArea"
                    />
                    <button type="submit" className="form-button">Send</button>
                    {status && <p className="status">{status}</p>}
                </form>
            </div>

            
        </div>
    );
};

export default ContactPage;