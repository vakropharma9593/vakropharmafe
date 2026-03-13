import AdminNavbar from "@/components/AdminNavbar";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";

const ContactSubmissions = () => {

    const [contactUs, setContactUs] = useState([]);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        const getContacts = async () => {
            setLoader(true);
            try {
                const res = await fetch("/api/contactus");

                const data = await res.json();
                setContactUs(data.data || []);
            } catch (error) {
                toast(`Failed to get contacts details. Please try again. ${error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: "error",
                    theme: "light",
                    transition: Bounce,
                });
            } finally {
                setLoader(false);
            }
        };
        getContacts();
    }, []);

  return (
    <div className="submissions-page">
      <AdminNavbar />
      <div className="submissions-content">
        <div className="submissions-header">
          <h1>
            Contact Submissions
            <span className="submissions-count">{contactUs.length}</span>
          </h1>
          <p>All contact form submissions from users.</p>
        </div>
        <div className="submissions-table-wrapper">
          {contactUs.length > 0 ? (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contactUs.map((submission: { id: string, name: string, email: string, phone: string, message: string }, index) => (
                  <tr key={submission?.id}>
                    <td>{index + 1}</td>
                    <td>{submission?.name}</td>
                    <td>{submission?.email}</td>
                    <td>{submission?.phone}</td>
                    <td className="message-cell">
                      <span className="message-text">{submission?.message}</span>
                      <div className="message-tooltip">{submission?.message}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="submissions-empty">
              <p>No submissions yet.</p>
            </div>
          )}
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default ContactSubmissions;
