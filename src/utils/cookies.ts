export const setCookie = (name: string, value: string, days: number = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  };
  
  export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  
  export const getWhitelistedTokens = (): WhitelistedToken[] => {
    const tokens = getCookie('whitelistedTokens');
    return tokens ? JSON.parse(tokens) : [];
  };
  
  export const saveWhitelistedTokens = (tokens: WhitelistedToken[]) => {
    setCookie('whitelistedTokens', JSON.stringify(tokens));
  };