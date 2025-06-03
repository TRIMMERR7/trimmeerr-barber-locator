
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/securityHelpers';

export const useSecurityMonitoring = () => {
  useEffect(() => {
    // Monitor authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          logSecurityEvent('user_login', {
            userId: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.app_metadata?.provider
          }, 'low');
          break;
        case 'SIGNED_OUT':
          logSecurityEvent('user_logout', {
            userId: session?.user?.id
          }, 'low');
          break;
        case 'TOKEN_REFRESHED':
          logSecurityEvent('token_refresh', {
            userId: session?.user?.id
          }, 'low');
          break;
        case 'PASSWORD_RECOVERY':
          logSecurityEvent('password_recovery_attempt', {
            email: session?.user?.email
          }, 'medium');
          break;
      }
    });

    // Monitor for suspicious URL patterns
    const checkSuspiciousActivity = () => {
      const url = window.location.href;
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /<script/i,
        /alert\(/i,
        /document\.cookie/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(url))) {
        logSecurityEvent('suspicious_url_detected', {
          url,
          timestamp: new Date().toISOString()
        }, 'high');
      }
    };

    // Store original console methods before overriding
    const originalConsole = { ...console };
    let consoleAccessCount = 0;

    const monitorConsoleAccess = () => {
      consoleAccessCount++;
      if (consoleAccessCount > 50) { // Threshold for suspicious activity
        logSecurityEvent('excessive_console_access', {
          count: consoleAccessCount,
          timestamp: new Date().toISOString()
        }, 'medium');
      }
    };

    // Override console methods to monitor access (excluding warn and error to avoid loops)
    const methodsToMonitor = ['log', 'info', 'debug', 'table', 'trace'];
    methodsToMonitor.forEach(method => {
      if (typeof console[method as keyof Console] === 'function') {
        const originalMethod = console[method as keyof Console] as Function;
        (console as any)[method] = (...args: any[]) => {
          monitorConsoleAccess();
          return originalMethod.apply(console, args);
        };
      }
    });

    // Check for suspicious activity on page load
    checkSuspiciousActivity();

    // Monitor for suspicious DOM manipulation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                logSecurityEvent('suspicious_dom_injection', {
                  tagName: element.tagName,
                  src: element.getAttribute('src'),
                  innerHTML: element.innerHTML?.substring(0, 100)
                }, 'high');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Monitor for rapid form submissions (potential automation)
    let formSubmissionTimes: number[] = [];
    const monitorFormSubmissions = (event: Event) => {
      const now = Date.now();
      formSubmissionTimes.push(now);
      
      // Keep only submissions from last 60 seconds
      formSubmissionTimes = formSubmissionTimes.filter(time => now - time < 60000);
      
      if (formSubmissionTimes.length > 5) { // More than 5 submissions per minute
        logSecurityEvent('rapid_form_submissions', {
          count: formSubmissionTimes.length,
          timestamps: formSubmissionTimes
        }, 'high');
        
        // Prevent the submission
        event.preventDefault();
        return false;
      }
    };

    document.addEventListener('submit', monitorFormSubmissions);

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      observer.disconnect();
      document.removeEventListener('submit', monitorFormSubmissions);
      
      // Restore original console methods
      Object.assign(console, originalConsole);
    };
  }, []);
};
