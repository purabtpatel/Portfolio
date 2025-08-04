import React, { useState } from 'react';
import './RedisTestPage.css';

export default function RedisTestPage() {
    const [redisResponse, setRedisResponse] = useState(null);
    const [nonRedisResponse, setNonRedisResponse] = useState(null);
    const [redisTime, setRedisTime] = useState(null);
    const [nonRedisTime, setNonRedisTime] = useState(null);
    const uri = import.meta.env.VITE_API_URL;
    const redisdata = `${uri}redis-data`;
    const nonRedisdata = `${uri}non-redis-data`;



    async function callRedis() {
        setRedisResponse(null);
        setRedisTime(null);
        const start = performance.now();
        try {
            const res = await fetch(redisdata);
            const data = await res.json();
            const end = performance.now();
            setRedisResponse(data);
            setRedisTime((end - start).toFixed(2));
        } catch {
            setRedisResponse({ error: 'Failed to fetch Redis data' });
        }
    }

    async function callNonRedis() {
        setNonRedisResponse(null);
        setNonRedisTime(null);
        const start = performance.now();
        try {
            const res = await fetch(nonRedisdata);
            const data = await res.json();
            const end = performance.now();
            setNonRedisResponse(data);
            setNonRedisTime((end - start).toFixed(2));
        } catch {
            setNonRedisResponse({ error: 'Failed to fetch non-cached data' });
        }
    }

    return (
        <div className="code-showcase-container">
            <div className="code-showcase-header">
                <h2>Redis vs Non-Redis Response Time Test</h2>
            </div>

            <div className="code-showcase">
                <div className="grid">
                    <button onClick={callRedis} style={{ marginRight: 10, padding: '8px 16px' }}>
                        Call Redis Cached Endpoint
                    </button>
                    {redisTime && <span>Response Time: {redisTime} ms</span>}
                    {redisResponse && (
                        <pre className="code-block">{JSON.stringify(redisResponse, null, 2)}</pre>
                    )}
                </div>

                <div className="grid" style={{ marginTop: 30 }}>
                    <button onClick={callNonRedis} style={{ marginRight: 10, padding: '8px 16px' }}>
                        Call Non-Cached Endpoint
                    </button>
                    {nonRedisTime && <span>Response Time: {nonRedisTime} ms</span>}
                    {nonRedisResponse && (
                        <pre className="code-block">{JSON.stringify(nonRedisResponse, null, 2)}</pre>
                    )}
                </div>
            </div>
        </div>
    );
}
