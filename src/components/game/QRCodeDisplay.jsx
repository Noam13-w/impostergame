import React from 'react';

export default function QRCodeDisplay({ code }) {
  // Simple QR code using external API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}&bgcolor=1e1b4b&color=a855f7`;
  
  return (
    <div className="flex justify-center">
      <div className="bg-white p-3 rounded-xl">
        <img 
          src={qrUrl} 
          alt="QR Code" 
          className="w-40 h-40"
        />
      </div>
    </div>
  );
}