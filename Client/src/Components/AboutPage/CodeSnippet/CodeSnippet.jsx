import React, { useState, useEffect } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml"; // needed for JSX/HTML
import "highlight.js/styles/atom-one-dark.css"; // or use another theme
import "./CodeSnippet.css";

// Register necessary languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);

const CodeSnippet = ({ raw_url }) => {
    const [highlightedCode, setHighlightedCode] = useState(null);
    const [error, setError] = useState(null);
    
    const uri = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchAndHighlightCode = async () => {
            try {
                const res = await fetch(`${uri}snippet?url=${encodeURIComponent(raw_url)}`);
                if (!res.ok) throw new Error("Network response was not ok");
                const code = await res.text();

                // Try JS first, fallback to auto
                const result = hljs.highlightAuto(code, ['javascript', 'xml']);
                const lines = result.value.split("\n");

                setHighlightedCode(lines);
            } catch (err) {
                console.error("Error fetching or highlighting snippet:", err);
                setError("// Error loading snippet");
            }
        };
        fetchAndHighlightCode();
    }, [raw_url]);

    if (error) {
        return <div className="code-snippet-line">{error}</div>;
    }

    if (!highlightedCode) {
        return <div className="code-snippet-line">// Loading...</div>;
    }

    return (

        <>
            {highlightedCode.map((line, index) => (
                <div className="code-snippet-line" key={index}>
                    <span className="code-line-number">{index + 1}</span>
                    <span
                        className="code-line-content"
                        dangerouslySetInnerHTML={{ __html: line || "\u00A0" }}
                    />
                </div>
            ))}

        </>
    );
};

export default CodeSnippet;
