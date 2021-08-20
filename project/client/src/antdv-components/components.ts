import {   
    Layout,
    Button,
    Spin,
    Result,
    Card,
    Divider,
    Col,
    Row,
    Drawer,
    Table,
    Form,
    InputNumber,
    Tag,
    Menu,
    Breadcrumb,
    PageHeader,
    Input,
    Dropdown
} from 'ant-design-vue';

export default function AntdvUi(app: any) {
    app.use(Layout);
    app.use(Button);
    app.use(Spin);
    app.use(Result);
    app.use(Card);
    app.use(Divider);
    app.use(Col);
    app.use(Row);
    app.use(Drawer);
    app.use(Table);
    app.use(Form);
    app.use(InputNumber);
    app.use(Tag);
    app.use(Menu);
    app.use(Breadcrumb);
    app.use(PageHeader);
    app.use(Input);
    app.use(Dropdown);
}