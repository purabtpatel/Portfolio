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

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = highlightedHTML;
        const plainText = tempDiv.textContent || ""; // to measure actual line length

        let currentLine = "";
        let raw = "";
        let visibleChars = 0;
        const output = [];

        const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
        let node;

        while ((node = walker.nextNode())) {
            const nodeText = node.nodeType === Node.TEXT_NODE ? node.textContent : node.outerHTML;
            const textContent = node.nodeType === Node.TEXT_NODE ? node.textContent : node.textContent;

            for (let i = 0; i < textContent.length; i++) {
                raw += nodeText[i] || "";
                visibleChars++;

                if (visibleChars >= charPerRow) {
                    output.push(raw);
                    raw = "";
                    visibleChars = 0;
                }
            }
        }

        if (raw.trim()) {
            output.push(raw);
        }

        return output;
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
