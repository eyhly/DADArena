import React, { useState } from 'react'

interface Location {
    latitude: number | null;
    longitude: number | null
}

export default function getLocation() {
    const [location, setLocation] = useState<Location | null>(null)
    
    const geoLocation = () => {
        
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
          const { latitude, longitude} = position.coords;
          setLocation({latitude, longitude})
        },
        (error) => {
            console.error(error.message)
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
    )
} else {
    console.error('Geolocation is not supported by your browser')
}
}
return (
    <>
    <button onClick={geoLocation}>Get Location</button>
    {location && (
        <div>

        </div>
    )}
    </>
  )
}
