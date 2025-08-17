// authentication utilities for password protection

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

// check if user is authenticated by verifying with server
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      credentials: 'include', // important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

// authenticate user with password
export async function authenticate(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Authentication failed' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Network error' };
  }
}

// logout user
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// set authentication status (for backward compatibility)
export function setAuthenticated(status: boolean): void {
  // This function is now deprecated - authentication is handled server-side
  console.warn('setAuthenticated is deprecated - use authenticate() instead');
}

// rate limiting for failed attempts (client-side for UX)
export function checkRateLimit(): boolean {
  const failedAttempts = parseInt(sessionStorage.getItem('failedAttempts') || '0');
  const lastAttemptTime = parseInt(sessionStorage.getItem('lastAttemptTime') || '0');
  const currentTime = Date.now();
  
  // reset if more than 5 minutes have passed
  if (currentTime - lastAttemptTime > 5 * 60 * 1000) {
    sessionStorage.setItem('failedAttempts', '0');
    return true;
  }
  
  // allow if less than 5 failed attempts
  if (failedAttempts < 5) {
    return true;
  }
  
  // calculate wait time (exponential backoff: 2^attempts minutes)
  const waitTime = Math.min(Math.pow(2, failedAttempts - 4) * 60 * 1000, 60 * 60 * 1000); // Max 1 hour
  const timeRemaining = waitTime - (currentTime - lastAttemptTime);
  
  if (timeRemaining <= 0) {
    sessionStorage.setItem('failedAttempts', '0');
    return true;
  }
  
  return false;
}

// record failed attempt
export function recordFailedAttempt(): void {
  const failedAttempts = parseInt(sessionStorage.getItem('failedAttempts') || '0');
  sessionStorage.setItem('failedAttempts', (failedAttempts + 1).toString());
  sessionStorage.setItem('lastAttemptTime', Date.now().toString());
}

// get remaining wait time in seconds
export function getRemainingWaitTime(): number {
  const failedAttempts = parseInt(sessionStorage.getItem('failedAttempts') || '0');
  const lastAttemptTime = parseInt(sessionStorage.getItem('lastAttemptTime') || '0');
  const currentTime = Date.now();
  
  if (failedAttempts < 5) return 0;
  
  const waitTime = Math.min(Math.pow(2, failedAttempts - 4) * 60 * 1000, 60 * 60 * 1000);
  const timeRemaining = waitTime - (currentTime - lastAttemptTime);
  
  return Math.max(0, Math.ceil(timeRemaining / 1000));
} 