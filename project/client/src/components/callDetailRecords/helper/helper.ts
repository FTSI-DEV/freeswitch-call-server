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
  
  export const data = [
    {
      key: '1',
      phoneNumberTo: 'John Brown',
      phoneNumberFrom: 32,
      callStatus: 'New York No. 1 Lake Park',
      duration: ['nice', 'developer'],
      dateCreated: ['nice', 'developer'],
      callDirection: ['nice', 'developer'],
    },
    {
      key: '1',
      phoneNumberTo: 'John Brown',
      phoneNumberFrom: 32,
      callStatus: 'New York No. 1 Lake Park',
      duration: ['nice', 'developer'],
      dateCreated: ['nice', 'developer'],
      callDirection: ['nice', 'developer'],
    },
    {
      key: '1',
      phoneNumberTo: 'John Brown',
      phoneNumberFrom: 32,
      callStatus: 'New York No. 1 Lake Park',
      duration: ['nice', 'developer'],
      dateCreated: ['nice', 'developer'],
      callDirection: ['nice', 'developer'],
    },
  ];

  export const CDRColumns = [
    {
      title: 'PhoneNumberTo',
      key: 'phoneNumberTo',
      dataIndex: 'phoneNumberTo',
      slots: { customRender: 'phoneNumberTo' },
    },
    {
      title: 'PhoneNumberFrom',
      key: 'phoneNumberFrom',
      dataIndex: 'phoneNumberFrom',
      slots: { customRender: 'phoneNumberFrom' },
    },
    {
      title: 'CallStatus',
      key: 'callStatus',
      dataIndex: 'callStatus',
      slots: { customRender: 'callStatus' },
    },
    {
      title: 'Duration',
      key: 'duration',
      dataIndex: 'duration',
      slots: { customRender: 'duration' },
    },
    {
      title: 'DateCreated',
      key: 'dateCreated',
      dataIndex: 'dateCreated',
      slots: { customRender: 'dateCreated' },
    },
    {
      title: 'CallDirection',
      key: 'callDirection',
      dataIndex: 'callDirection',
      slots: { customRender: 'callDirection' },
    },
    {
      title: 'Action',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]