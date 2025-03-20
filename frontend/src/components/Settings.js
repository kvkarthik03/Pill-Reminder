import React, { useState } from 'react';
import { playNotificationSound } from '../utils/sound';

const Settings = () => {
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('notificationSound') !== 'disabled'
  );

  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notificationSound', newValue ? 'enabled' : 'disabled');
    
    // Test sound when enabling
    if (newValue) {
      try {
        await playNotificationSound(true); // true for test mode
      } catch (err) {
        console.warn('Could not play test sound:', err);
      }
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={toggleSound}
          />
          Enable Notification Sounds
        </label>
        <button 
          onClick={() => playNotificationSound(true)}
          className="test-sound-btn"
        >
          Test Sound
        </button>
      </div>
    </div>
  );
};

export default Settings;
