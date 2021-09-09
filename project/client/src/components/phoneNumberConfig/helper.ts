export default [
    {
      title: "Friendly Name",
      dataIndex: "friendlyName",
      key: "friendlyName",
    },
    {
      title: "HTTP Method",
      dataIndex: "httpMethod",
      key: "httpMethod",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Weebhook URL",
      dataIndex: "webhookUrl",
      key: "webhookUrl",
    },
    {
      title: "Action",
      slots: { customRender: "action" },
      dataIndex: "webhookUrl",
    },
  ]