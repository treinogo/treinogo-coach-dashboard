import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function StravaCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Strava authorization error:', error);
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'strava-auth',
            error: error,
          },
          window.location.origin
        );
        window.close();
      }
      return;
    }

    if (code) {
      // Send code to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'strava-auth',
            code: code,
          },
          window.location.origin
        );
        // Keep window open briefly to show success message
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // If no opener, redirect to settings page with code
        window.location.href = `/configuracoes?strava_code=${code}`;
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Conectando com Strava...</p>
      </div>
    </div>
  );
}
