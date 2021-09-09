export default [
    {
      title: "Caller Id",
      dataIndex: "callerId",
      key: "callerId",
    },
    {
      title: "HTTP Method",
      dataIndex: "httpMethod",
      key: "httpMethod"
    },
    {
      title: "Webhook URL",
      dataIndex: "webhookUrl",
      key: "webhookUrl",
    },
    {
      title: "Action",
      slots: { customRender: "action" },
    },
  ]