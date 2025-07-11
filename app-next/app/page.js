import MealsList from "../components/MealsList/MealsList";
// import Navigation from "@/components/Navigation/Navigation";

export default function HomePage() {
  return (
    <div>
      {/* <Navigation /> */}
      <MealsList limit={3} />
    </div>
  );
}
