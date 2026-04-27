import { createContext, useContext, useState } from "react";

const TripContext = createContext(null);

const INITIAL_STATE = {
  /* Route selection */
  from:       null,   // "Hyderabad"
  to:         null,   // "Mumbai"
  mode:       "road", // "road" | "train" | "air"
  travelDate: null,

  /* Route result (from OSRM) */
  route: null,        // { latLngs, distKm, timeHrs }

  /* Content loaded from API */
  stops:  [],
  hotels: [],
  guides: [],

  /* Booking wizard */
  booking: {
    type:        null,   // "self" | "parcel" | "documents" | "furniture" | "vehicle" | "other"
    weightKg:    50,
    passengers:  1,
    details:     {},     // name, phone, pickup, drop, notes
    selectedPlan:"smart",// "economy" | "smart" | "premium"
    confirmed:   false,
    refId:       null,
  },
};

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(INITIAL_STATE);

  /* Helpers — update a nested key without replacing everything */
  function setRoute(from, to, mode = "road") {
    setTrip(prev => ({ ...prev, from, to, mode, route: null, stops: [], hotels: [], guides: [] }));
  }

  function setRouteResult(result) {
    setTrip(prev => ({ ...prev, route: result }));
  }

  function setContent({ stops, hotels, guides }) {
    setTrip(prev => ({ ...prev, stops, hotels, guides }));
  }

  function setBookingField(key, value) {
    setTrip(prev => ({
      ...prev,
      booking: { ...prev.booking, [key]: value },
    }));
  }

  function setBookingDetails(details) {
    setTrip(prev => ({
      ...prev,
      booking: { ...prev.booking, details },
    }));
  }

  function confirmBooking(refId) {
    setTrip(prev => ({
      ...prev,
      booking: { ...prev.booking, confirmed: true, refId },
    }));
  }

  function resetTrip() {
    setTrip(INITIAL_STATE);
  }

  return (
    <TripContext.Provider
      value={{
        trip,
        setRoute,
        setRouteResult,
        setContent,
        setBookingField,
        setBookingDetails,
        confirmBooking,
        resetTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

/* Hook — use this in every component instead of raw useContext */
export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside <TripProvider>");
  return ctx;
}
