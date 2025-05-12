import React, { useEffect, useState, useRef } from "react";
import "./CodeComment.css";

const CodeComment = ({ text }) => {
  const [formattedLines, setFormattedLines] = useState([]);
  const containerRef = useRef(null);

  const splitTextIntoLines = (text, containerWidth) => {
    const charPerRow = Math.max(10, Math.floor(containerWidth / 8));
    const rawLines = text.split("\n");
    const lines = [];

    rawLines.forEach((rawLine, rawIndex) => {
      if (rawLine.trim() === "") {
        // Preserve empty lines (e.g., from \n\n)
        lines.push("");
      } else {
        const words = rawLine.trim().split(/\s+/);
        let currentLine = "";

        words.forEach((word) => {
          if ((currentLine + word).length > charPerRow) {
            if (currentLine.trim()) {
              lines.push(currentLine.trim());
            }
            currentLine = word + " ";
          } else {
            currentLine += word + " ";
          }
        });

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
      }
    });

    return lines;
  };

  useEffect(() => {
    const updateLines = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setFormattedLines(splitTextIntoLines(text, width - 100));
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
        {formattedLines.map((line, index) => (
          <div className="code-grid-row" key={index + 2}>
            <span className="code-line-number">{index + 2}</span>
            <span className="comment-symbol">*</span>
            <span className="code-text">{line}</span>
          </div>
        ))}
      </div>
      <div className="code-line">
        <span className="code-line-number">{formattedLines.length + 2}</span>
        <span style={{ marginLeft: "15px" }}>*/</span>
      </div>
    </div>
  );
};

export default CodeComment;