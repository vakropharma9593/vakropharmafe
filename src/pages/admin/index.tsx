"use-client";

import { Mail, Home } from "lucide-react";
import { useRouter } from "next/router";
import AdminNavbar from "@/components/AdminNavbar";

const Admin = () => {
    const router = useRouter();

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-welcome">
          <h1>Welcome to Admin Dashboard</h1>
          <p>Manage your website content and view submissions.</p>
        </div>
        <div className="admin-cards">
          <div className="admin-card" onClick={() => router.push("/admin/contactus")}>
            <div className="admin-card-icon primary">
              <Mail size={24} />
            </div>
            <h3>Contact Submissions</h3>
            <p>View all contact form submissions from users.</p>
          </div>
          <div className="admin-card" onClick={() => router.replace("/")}>
            <div className="admin-card-icon secondary">
              <Home size={24} />
            </div>
            <h3>View Website</h3>
            <p>Go to the main website homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
