export const BASE_URL = "https://worldwide-server.azurewebsites.net"
export async function privateFetch(url, options, token, refreshFnc) {
  if (token) {
    const tokenHeder = { Authorization: `Bearer ${token}` };
    options = options
      ? { ...options, headers: { ...options.headers, ...tokenHeder } }
      : { headers: tokenHeder };
  }

  const res = await _privateFetch(url, options);
  if (res.error && res.code === 401) {
    const token = await refreshAccessToken();
    if (token) {
      refreshFnc?.(token);
      options.headers.Authorization = `Bearer ${token}`;
      return await _privateFetch(url, options);
    }
  }
  return res;
}

async function _privateFetch(url, options) {
  // Define default headers you want to include in every request
  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add any other fixed headers here
  };

  // Merge default and custom headers (if provided)
  const headers = {
    ...defaultHeaders,
    ...(options ? options.headers : {}),
  };

  // Override 'headers' in options with the merged headers
  options = { ...options, headers, credentials: "include" };

  try {
    // Perform the fetch with updated options
    return await (await fetch(url, options)).json();
  } catch (error) {
    error.error = error.message;
    return error;
  }
}

export async function refreshAccessToken() {
  try {
    const res = await _privateFetch(`${BASE_URL}/api/auth/token`);
    if (res.data) return res.data.token; //token
  } catch (err) {
    console.error(err);
    return false;
  }
}
