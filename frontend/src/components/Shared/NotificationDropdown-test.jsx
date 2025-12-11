import { useState } from 'react';

export default function NotificationDropdownTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log('TEST: Button clicked!');
          setIsOpen(!isOpen);
        }}
        style={{
          background: 'blue',
          color: 'white',
          padding: '10px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        TEST BELL
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            background: 'red',
            color: 'white',
            padding: '20px',
            zIndex: 9999
          }}
        >
          <h3>TEST DROPDOWN</h3>
          <p>This is a test dropdown!</p>
        </div>
      )}
    </div>
  );
}
