import { useNavigate } from "react-router-dom";

const SelectRole = () => {

  const navigate = useNavigate();

  const chooseRole = (role) => {

    console.log("Role selected:", role);

    localStorage.setItem("role", role);

    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h1>Select Your Role</h1>

      <br />

      <button onClick={() => chooseRole("seller")}>
        I want to Sell Property
      </button>

      <br /><br />

      <button onClick={() => chooseRole("agent")}>
        I am an Agent
      </button>

      <br /><br />

      <button onClick={() => chooseRole("builder")}>
        I am a Builder
      </button>

    </div>
  );
};

export default SelectRole;