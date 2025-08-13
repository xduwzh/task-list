import { useState } from "react";
import { Button, Card, Typography, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

function App() {
  const [status, setStatus] = useState<string>("unknown");

  const ping = async () => {
    try {
      const res = await axios.get("/api/health");
      setStatus(JSON.stringify(res.data));
      message.success("Backend OK");
    } catch (e: any) {
      setStatus(e?.message || "error");
      message.error("Backend not reachable");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Card style={{ width: 520 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          Gin + GORM + PG + React + AntD
        </Title>
        <Text>Click to check backend health</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={ping}>
            Check /api/health
          </Button>
        </div>
        <pre
          style={{
            marginTop: 16,
            background: "#f6f6f6",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {status}
        </pre>
      </Card>
    </div>
  );
}

export default App;
