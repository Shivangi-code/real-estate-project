import { useNavigate } from "react-router-dom";

const Onboarding = () => {

  const navigate = useNavigate();

  const selectRole = (role) => {
    localStorage.setItem("role", role);

    if (role === "seller") navigate("/seller");
    if (role === "agent") navigate("/agent");
    if (role === "builder") navigate("/builder");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Select Your Role</h1>

      <button onClick={() => selectRole("seller")}>
        I want to sell property
      </button>

      <button onClick={() => selectRole("agent")}>
        I am a real estate agent
      </button>

      <button onClick={() => selectRole("builder")}>
        I am a builder / developer
      </button>
    </div>
  );
};

export default Onboarding;