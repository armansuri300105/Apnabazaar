import { LocateIcon } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { CiLocationOn } from "react-icons/ci";
import { CartProductContext } from "../../services/context";

const LocationFetcher = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [city, setCity] = useState(null);
  const [permission, setPermission] = useState("prompt"); // prompt | granted | denied
  const [error, setError] = useState("");
  const {setUserLocation} = useContext(CartProductContext)

  // ---- Reverse Geocoding ----
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data?.address?.city || data?.address?.town || data?.address?.village || "";
    } catch {
      return "";
    }
  };

  // ---- Request User Location ----
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setPermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };

        setLocation(coords);
        setPermission("granted");

        // Reverse Geocode
        const detectedCity = await reverseGeocode(coords.lat, coords.lon);
        setCity(detectedCity);
        setUserLocation(detectedCity)
      },
      (err) => {
        setError(err.message);
        setPermission("denied");
      }
    );
  };

  // ---- Auto-fetch on mount ----
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      {/* Permission Message */}
      {permission === "denied" && (
        <div></div>
      )}

      {/* City Display */}
      {city ? (
        <p className="flex gap-[3px] items-center"><CiLocationOn/><strong className="text-blue-600">{city}</strong></p>
      ) : permission !== "denied" ? (
        <p>Requesting location...</p>
      ) : <div></div>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LocationFetcher;