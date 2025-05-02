// ContactForm.jsx
import { useState } from "react";
import "./ContactPage.css"; // Assuming you have a CSS file for styling
import AboutContactsComponent from "../AboutPage/AboutContactsComponent/AboutContactsComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CodeSnippet from "../AboutPage/CodeSnippet/CodeSnippet";

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
        <div className="contact-Page">
            <div className="contacts-section-Header">
                <AboutContactsComponent />
            </div>
            <div className="contact-main-page">
                <div className="contact-header">
                    <span>professional-info</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>

                <div className="contact-body-content" >
                    <div className="contact-Form">
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
                    <div className="code-snippet-scroll-container">
                        <CodeSnippet raw_url="https://github.com/purabtpatel/Portfolio/raw/f672fb1764f36b76449865afff2ef49b2d35d606/Client%2Fsrc%2FComponents%2FContactPage%2FContactPage.jsx
" />

                    </div>
                </div>

            </div>

        </div>
    );
};

export default ContactPage;