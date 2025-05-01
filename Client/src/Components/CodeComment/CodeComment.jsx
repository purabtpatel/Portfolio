import React, { useEffect, useState, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/atom-one-dark.css";
import "./CodeComment.css";

// Register only what you need
hljs.registerLanguage("javascript", javascript);

const CodeComment = ({ text }) => {
    const [highlightedLines, setHighlightedLines] = useState([]);
    const containerRef = useRef(null);

    const splitHighlightedHTMLIntoLines = (highlightedHTML, containerWidth) => {
        const charPerRow = Math.max(10, Math.floor(containerWidth / 8));
        const container = document.createElement("div");
        container.innerHTML = highlightedHTML;
    
        const lines = [];
        let currentLine = "";
        let currentLength = 0;
    
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    
        while (walker.nextNode()) {
            const node = walker.currentNode;
    
            const processWord = (word, className = "") => {
                const cleanWord = word.replace(/\s/g, "\u00A0"); // preserve spacing
                const styledWord = className
                    ? `<span class="${className}">${cleanWord}</span>`
                    : cleanWord;
    
                if (currentLength + word.length > charPerRow) {
                    if (currentLine.trim()) lines.push(currentLine.trim());
                    currentLine = "";
                    currentLength = 0;
                }
    
                currentLine += styledWord;
                currentLength += word.length;
            };
    
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/); // split and preserve whitespace
                words.forEach(word => processWord(word));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                words.forEach(word => processWord(word, node.className));
            }
        }
    
        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }
    
        return lines;
    };

    useEffect(() => {
        const updateLines = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                const highlighted = hljs.highlightAuto(text, ['javascript']).value;
                const splitLines = splitHighlightedHTMLIntoLines(highlighted, width - 100);
                setHighlightedLines(splitLines);
            }
        };

        updateLines();
        window.addEventListener("resize", updateLines);
        return () => window.removeEventListener("resize", updateLines);
    }, [text]);

    return (
        <div className="code-container" ref={containerRef}>
            <div className="code-line">
                <span className="code-line-number">1</span>
                <span>/**</span>
            </div>
            <div className="code-content">
                {highlightedLines.map((line, index) => (
                    <div className="code-grid-row" key={index + 2}>
                        <span className="code-line-number">{index + 2}</span>
                        <span className="comment-symbol">*</span>
                        <span className="code-text" dangerouslySetInnerHTML={{ __html: line }} />
                    </div>
                ))}
            </div>
            <div className="code-line">
                <span className="code-line-number">{highlightedLines.length + 2}</span>
                <span style={{ marginLeft: "15px" }}>*/</span>
            </div>
        </div>
    );
};

export default CodeComment;
