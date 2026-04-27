import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TripProvider } from "./context/TripContext";

// Pages
import HomePage       from "./pages/HomePage";
// import PlannerPage    from "./pages/PlannerPage";
// import MapPage        from "./pages/MapPage";
// import StopsPage      from "./pages/StopsPage";
// import HotelsPage     from "./pages/HotelsPage";
// import GuidesPage     from "./pages/GuidesPage";
// import BookingPage    from "./pages/BookingPage";
// import NotFoundPage   from "./pages/NotFoundPage";

/* Scroll to top on every route change */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/* Page transition wrapper — fades in on mount */
function PageWrapper({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.25s ease";
    const t = setTimeout(() => {
      document.body.style.opacity = "1";
    }, 10);
    return () => clearTimeout(t);
  }, [pathname]);
  return children;
}

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <ScrollReset />
        <PageWrapper>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/plan"      element={<PlannerPage />} />
            <Route path="/map"       element={<MapPage />} />
            <Route path="/stops"     element={<StopsPage />} />
            <Route path="/hotels"    element={<HotelsPage />} />
            <Route path="/guides"    element={<GuidesPage />} />
            <Route path="/booking"   element={<BookingPage />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </PageWrapper>
      </BrowserRouter>
    </TripProvider>
  );
}
