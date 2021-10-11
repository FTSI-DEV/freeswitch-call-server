export const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      slots: { title: 'customTitle', customRender: 'name' },
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      slots: { customRender: 'tags' },
    },
    {
      title: 'Action',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ];
  
  

  export const CDRColumns = [
    // {
    //   title: 'Call Status',
    //   key: 'CallStatus',
    //   dataIndex: 'CallStatus',
    //   slots: { customRender: 'CallStatus' },
    // },
        {
      title: 'Call Direction',
      key: 'CallDirection',
      dataIndex: 'CallDirection',
      slots: { customRender: 'CallDirection' },
    },
    {
      title: 'Phone Number From',
      key: 'PhoneNumberFrom',
      dataIndex: 'PhoneNumberFrom',
      slots: { customRender: 'PhoneNumberFrom' },
    },
    {
      title: 'Phone Number To',
      key: 'PhoneNumberTo',
      dataIndex: 'PhoneNumberTo',
      slots: { customRender: 'PhoneNumberTo' },
    },
    // {
    //   title: 'Duration',
    //   key: 'Duration',
    //   dataIndex: 'Duration',
    //   slots: { customRender: 'Duration' },
    // },
    // {
    //   title: 'Date Created',
    //   key: 'DateCreated',
    //   dataIndex: 'DateCreated',
    //   slots: { customRender: 'DateCreated' },
    // },
    // {
    //   title: 'Call Direction',
    //   key: 'CallDirection',
    //   dataIndex: 'CallDirection',
    //   slots: { customRender: 'CallDirection' },
    // },

    {
      title: 'Action',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]