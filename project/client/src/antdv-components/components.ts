import { Button , Input, Row, Col} from 'ant-design-vue';

export default function AntdvUi(app: any) {
    app.use(Button);
    app.use(Input);
    app.use(Row);
    app.use(Col);
}