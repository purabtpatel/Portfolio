import React, { useState, useEffect } from 'react';


const CodeSnippet = ({ raw_url }) => {
    const [code, setCode] = useState('Loading...');


    useEffect(() => {
        const fetchCode = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/snippet?url=${encodeURIComponent(raw_url)}`);
                console.log('Response from server:', res); // 👈 This will show what the server returns
                const text = await res.text();
                setCode(text);
            } catch (err) {
                setCode('// Error loading snippet');
            }
        };
        fetchCode();
    }, [raw_url]);

    return (
        <pre className="code-card-snippet">
            <code>{code}</code>
        </pre>
    );
};

export default CodeSnippet;