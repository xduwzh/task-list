import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  List,
  Popconfirm,
  Space,
  Typography,
  message,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./api/todo";
import type { Todo } from "./types/todo";

const { Title, Text } = Typography;

function App() {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (toPage = page, toPageSize = pageSize) => {
    setLoading(true);
    try {
      const data = await listTodos(toPage, toPageSize);
      setItems(data.list);
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.page_size);
    } catch (e: any) {
      message.error(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdd = async () => {
    try {
      const values = await form.validateFields();
      await createTodo(values.title);
      form.resetFields();
      message.success("Created");
      // reload first page to see the new item (sorted by created_at desc on backend)
      await load(1, pageSize);
    } catch (e: any) {
      if (e?.errorFields) return; // form validation error
      message.error(e?.message || "Create failed");
    }
  };

  const onToggle = async (item: Todo, done: boolean) => {
    // optimistic update
    const prev = [...items];
    setItems((arr) => arr.map((t) => (t.id === item.id ? { ...t, done } : t)));
    try {
      await updateTodo(item.id, { done });
    } catch (e: any) {
      setItems(prev);
      message.error("Update failed");
    }
  };

  const onDelete = async (id: number) => {
    const prev = [...items];
    setItems((arr) => arr.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
      message.success("Deleted");
      // if current page becomes empty, go back one page
      if (items.length === 1 && page > 1) {
        await load(page - 1, pageSize);
      } else {
        await load(page, pageSize);
      }
    } catch (e: any) {
      setItems(prev);
      message.error("Delete failed");
    }
  };

  const header = useMemo(
    () => (
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          Todo Demo
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => load(page, pageSize)}
          />
        </Space>
      </Space>
    ),
    [page, pageSize]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Card style={{ width: 680 }} title={header}>
        <Text type="secondary"></Text>

        <Form
          form={form}
          layout="inline"
          style={{ marginTop: 16 }}
          onFinish={onAdd}
        >
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Title required" },
              { max: 200 },
            ]}
            style={{ flex: 1 }}
          >
            <Input placeholder="What needs to be done?" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add
            </Button>
          </Form.Item>
        </Form>

        <List
          style={{ marginTop: 16 }}
          loading={loading}
          dataSource={items}
          locale={{ emptyText: "No items" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="del"
                  title="Delete this todo?"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => onDelete(item.id)}
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>,
              ]}
            >
              <Space align="start">
                <Checkbox
                  checked={item.done}
                  onChange={(e) => onToggle(item, e.target.checked)}
                />
                <div>
                  <div
                    style={{
                      textDecoration: item.done ? "line-through" : "none",
                    }}
                  >
                    {item.title}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    #{item.id} • {new Date(item.created_at).toLocaleString()}
                  </Text>
                </div>
              </Space>
            </List.Item>
          )}
        />

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
        >
          <Pagination
            size="small"
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => load(p, ps)}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </Card>
    </div>
  );
}

export default App;
