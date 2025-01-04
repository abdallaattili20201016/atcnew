import React, { useEffect, useState } from "react";
import { getDocs, collection, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../helpers/config"; // Ensure db is correctly imported
import { fetchUserNameById as loadUserName } from "../../helpers/firebase_helper";

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userId.toLowerCase().includes(search.toLowerCase());
    const matchesAction =
      filterAction === "" || log.action === filterAction;
    const matchesUserId = filterUserId === "" || log.userId === filterUserId;

    return matchesSearch && matchesAction && matchesUserId;
  });


  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to fetch logs.");
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const uniqueIds = Array.from(new Set(filteredLogs.map((log) => log.userId)));
        const namesMap: { [key: string]: string } = {};
        await Promise.all(
          uniqueIds.map(async (userId) => {
            const name = await loadUserName(userId);
            namesMap[userId] = name;
          })
        );
        setUserNames(namesMap);
      } catch (err) {
        console.error("Error fetching user names:", err);
        setError("Failed to fetch user names.");
      }
    };
    if (filteredLogs.length > 0) {
      fetchNames();
    } else {
      setUserNames({});
    }
  }, [filteredLogs]);

  const formatDetails = (details: any): JSX.Element => {
    if (!details || typeof details !== "object") return <span>{details}</span>;

    if (details.updates) {
      const updates = details.updates;
      const original = details.original || {};
      const changes: { [key: string]: any } = {};

      const formatValue = (value: any) => {
        if (value instanceof Timestamp) {
          return value.toDate().toLocaleString();
        }
        return value;
      };

      Object.keys(updates).forEach((key) => {
        if (formatValue(original[key]) !== formatValue(updates[key])) {
          changes[key] = {
            from: formatValue(original[key]) || "N/A",
            to: formatValue(updates[key]),
          };
        }
      });

      return (
        <div>
          {Object.keys(changes).length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(changes).map(([field, { from, to }]) => (
                  <tr key={field}>
                    <td>{field}</td>
                    <td>{from}</td>
                    <td>{to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No changes detected.</p>
          )}
        </div>
      );
    }

    return (
      <pre className="text-wrap bg-light p-2 rounded">
        {JSON.stringify(details, (key, value) => {
          if (value instanceof Timestamp) {
            return value.toDate().toLocaleString();
          }
          return value;
        }, 2)}
      </pre>
    );
  };

  const handleExportCSV = () => {
    const csvData = logs.map((log) => ({
      Action: log.action,
      Details: JSON.stringify(log.details),
      "User ID": log.userId,
      Timestamp: new Date(log.timestamp.toDate()).toLocaleString(),
    }));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Action,Details,User ID,Timestamp"]
        .concat(
          csvData.map((row) =>
            [row.Action, row.Details, row["User ID"], row.Timestamp].join(",")
          )
        )
        .join("\n");
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    // saveAs(blob, "audit_logs.csv");
  };

  

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">Audit Logs</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="row">
              <div className="col-md-6">
                <select
                  className="form-select mb-2"
                  title="Filter by Action"
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                >
                  <option value="">Filter by Action</option>
                  {Array.from(new Set(logs.map((log) => log.action))).map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select mb-2"
                  title="Filter by User ID"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                >
                  <option value="">Filter by User ID</option>
                  {Array.from(new Set(logs.map((log) => log.userId))).map((userId) => (
                    <option key={userId} value={userId}>
                      {userId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            className="btn btn-success mb-3"
            onClick={handleExportCSV}
          >
            Export CSV
          </button>
          {filteredLogs.length === 0 ? (
            <div className="text-center">
              <p className="text-muted">No logs available</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Details</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>
                        <button
                          className="btn btn-link text-decoration-none"
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(`details-${log.id}`)
                              ?.classList.toggle("show")
                          }
                        >
                          View Details
                        </button>
                        <div
                          className="collapse mt-2"
                          id={`details-${log.id}`}
                        >
                          {formatDetails(log.details)}
                        </div>
                      </td>
                      <td>{userNames[log.userId] || "Loading..."}</td>
                      <td>{new Date(log.timestamp.toDate()).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
