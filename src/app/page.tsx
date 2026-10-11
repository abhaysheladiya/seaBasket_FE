import type { Metadata } from "next";
import HomeContent from "./components/HomeContent";

export const metadata: Metadata = {
  title: "SeaBasket",
  description: "Fresh Food and daily catches delivered to your door.",
};
const Home = () => {
  return <HomeContent />;
};
export default Home;
