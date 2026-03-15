import { useSearchParams } from "react-router-dom";

const Properties = () => {

  const [params] = useSearchParams();

  const city = params.get("city");
  const area = params.get("area");
  const type = params.get("type");
  const bhk = params.get("bhk");
  const maxPrice = params.get("maxPrice");

  console.log("Filters:", { city, area, type, bhk, maxPrice });

  return (
    <div style={{ padding: "40px" }}>

      <h1>Properties</h1>

      <p>City: {city}</p>
      <p>Area: {area}</p>
      <p>Type: {type}</p>
      <p>BHK: {bhk}</p>
      <p>Budget: {maxPrice}</p>

    </div>
  );
};

export default Properties;