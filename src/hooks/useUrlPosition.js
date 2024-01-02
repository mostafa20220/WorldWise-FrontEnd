import React from 'react'
import { useSearchParams } from 'react-router-dom';

export function useUrlPosition() {
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat || null ,lng || null];
}
