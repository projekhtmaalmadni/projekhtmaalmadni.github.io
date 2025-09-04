#!/bin/bash

# Simple test script to validate website functionality
echo "Testing local website functionality..."

# Start HTTP server in background
python3 -m http.server 8001 > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test if pages load without critical errors
echo "Testing index.html..."
curl -s http://localhost:8001/ | grep -q "Transform Your Digital Presence"
if [ $? -eq 0 ]; then
    echo "✓ index.html loads successfully"
else
    echo "✗ index.html failed to load properly"
fi

echo "Testing qaraa.html..."
curl -s http://localhost:8001/qaraa.html | grep -q "Qara'a"
if [ $? -eq 0 ]; then
    echo "✓ qaraa.html loads successfully"
else
    echo "✗ qaraa.html failed to load properly"
fi

echo "Testing assets..."
curl -s -I http://localhost:8001/assets/css/tailwind.css | grep -q "200 OK"
if [ $? -eq 0 ]; then
    echo "✓ CSS assets load successfully"
else
    echo "✗ CSS assets failed to load"
fi

curl -s -I http://localhost:8001/assets/images/hotama-logo.png | grep -q "200 OK"
if [ $? -eq 0 ]; then
    echo "✓ Image assets load successfully"
else
    echo "✗ Image assets failed to load"
fi

# Clean up
kill $SERVER_PID

echo "Test completed!"