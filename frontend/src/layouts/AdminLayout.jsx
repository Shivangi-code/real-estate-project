import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>

        <nav>
          <Link style={styles.link} to="/admin/overview">Overview</Link>
          <Link style={styles.link} to="/admin/properties/pending">Pending Properties</Link>
          <Link style={styles.link} to="/admin/properties/approved">Approved Properties</Link>
          <Link style={styles.link} to="/admin/users">Users</Link>
        </nav>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h3>Admin Dashboard</h3>
        </div>

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    marginBottom: "20px",
  },
  link: {
    display: "block",
    color: "white",
    textDecoration: "none",
    margin: "10px 0",
  },
  logout: {
    padding: "10px",
    background: "#dc2626",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    padding: "15px",
    background: "white",
    borderBottom: "1px solid #ddd",
  },
  content: {
    padding: "20px",
    overflowY: "auto",
  },
};

export default AdminLayout;