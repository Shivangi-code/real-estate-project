import { useNavigate } from "react-router-dom";

const ChooseAction = () => {

  const navigate = useNavigate();

  const handleBuy = () => {

    console.log("User wants to BUY");

    localStorage.setItem("userType", "buyer");

    navigate("/login");
  };

  const handleSell = () => {

    console.log("User wants to SELL");

    navigate("/select-role");
  };

  return (
    <div style={{ padding: "60px", textAlign: "center" }}>

      <h1>What do you want to do?</h1>

      <br /><br />

      <button onClick={handleBuy}>
        I Want to Buy Property
      </button>

      <br /><br />

      <button onClick={handleSell}>
        I Want to Sell Property
      </button>

    </div>
  );
};

export default ChooseAction;