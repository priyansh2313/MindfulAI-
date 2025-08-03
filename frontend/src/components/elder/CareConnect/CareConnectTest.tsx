import React, { useState } from 'react';
import careConnectAnalytics from '../../../utils/careConnectAnalytics';
import careConnectStorage from '../../../utils/careConnectStorage';
import CareConnectDashboard from './CareConnectDashboard';

const CareConnectTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = async () => {
    setIsRunningTests(true);
    const results: string[] = [];

    try {
      // Test 1: Analytics
      try {
        careConnectAnalytics.trackFeatureUsage('test', 'analytics', true);
        results.push('✅ Analytics tracking working');
      } catch (error) {
        results.push('❌ Analytics tracking failed');
      }

      // Test 2: Storage
      try {
        careConnectStorage.saveSettings({ test: true });
        const settings = careConnectStorage.getSettings();
        if (settings.test) {
          results.push('✅ Local storage working');
        } else {
          results.push('❌ Local storage failed');
        }
      } catch (error) {
        results.push('❌ Local storage failed');
      }

      // Test 3: Service Worker
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          if (registration) {
            results.push('✅ Service Worker registered');
          } else {
            results.push('❌ Service Worker registration failed');
          }
        } else {
          results.push('⚠️ Service Worker not supported');
        }
      } catch (error) {
        results.push('❌ Service Worker failed');
      }

      // Test 4: Voice Recognition
      try {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          results.push('✅ Voice recognition supported');
        } else {
          results.push('⚠️ Voice recognition not supported');
        }
      } catch (error) {
        results.push('❌ Voice recognition test failed');
      }

      // Test 5: Push Notifications
      try {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          results.push('✅ Push notifications supported');
        } else {
          results.push('⚠️ Push notifications not supported');
        }
      } catch (error) {
        results.push('❌ Push notifications test failed');
      }

      // Test 6: Local Storage
      try {
        localStorage.setItem('test', 'value');
        const testValue = localStorage.getItem('test');
        if (testValue === 'value') {
          results.push('✅ Local storage working');
        } else {
          results.push('❌ Local storage failed');
        }
        localStorage.removeItem('test');
      } catch (error) {
        results.push('❌ Local storage failed');
      }

    } catch (error) {
      results.push('❌ Test suite failed');
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const clearTests = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>Care Connect Test Suite</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={runTests}
            disabled={isRunningTests}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {isRunningTests ? 'Running Tests...' : 'Run Tests'}
          </button>
          
          <button 
            onClick={clearTests}
            style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Clear Results
          </button>
        </div>

        {testResults.length > 0 && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '15px', 
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} style={{ 
                padding: '8px 0', 
                borderBottom: index < testResults.length - 1 ? '1px solid #e2e8f0' : 'none',
                fontSize: '14px'
              }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2563eb', marginBottom: '20px' }}>Care Connect Dashboard</h2>
        <CareConnectDashboard />
      </div>
    </div>
  );
};

export default CareConnectTest; 