import StatusBar from "./components/ui/StatusBar";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import MapRoomCodes from "./components/modules/MapRoomCodes";
import SeasonMissions from "./components/modules/SeasonMissions";
import LoadoutSetups from "./components/modules/LoadoutSetups";
import DepartmentPriority from "./components/modules/DepartmentPriority";
import EventItems from "./components/modules/EventItems";
import HotEventsNews from "./components/modules/HotEventsNews";

export default function App() {
  return (
    <div className="tactical-bg min-h-screen">
      <div className="relative z-10">
        <StatusBar />
        <Header />
        <main>
          <MapRoomCodes />
          <SeasonMissions />
          <LoadoutSetups />
          <DepartmentPriority />
          <EventItems />
          <HotEventsNews />
        </main>
        <Footer />
      </div>
    </div>
  );
}
