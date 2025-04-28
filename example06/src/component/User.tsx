import { 
    Create,
    Datagrid, 
    DeleteButton, 
    Edit, 
    EditButton, 
    List, 
    SimpleForm, 
    TextField, 
    TextInput,
    PasswordInput,
    EmailField,
    required,
    email,
    ArrayField,
    SingleFieldList,
    ChipField,
    NumberField
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="User ID" />
            <TextField source="firstName" label="First Name" />
            <TextField source="lastName" label="Last Name" />
            <EmailField source="email" label="Email" />
            <TextField source="mobileNumber" label="Mobile Number" />
            <ArrayField source="roles">
                <SingleFieldList>
                    <ChipField source="roleName" />
                </SingleFieldList>
            </ArrayField>
            <TextField source="address.street" label="Street" />
            <TextField source="address.buildingName" label="Building" />
            <TextField source="address.city" label="City" />
            <TextField source="address.state" label="State" />
            <TextField source="address.country" label="Country" />
            <TextField source="address.pincode" label="Pincode" />
            <NumberField source="cart.totalPrice" label="Cart Total" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="firstName" label="First Name" validate={[required()]} />
            <TextInput source="lastName" label="Last Name" validate={[required()]} />
            <TextInput source="email" label="Email" validate={[required(), email()]} />
            <PasswordInput source="password" label="Password" validate={[required()]} />
            <TextInput source="mobileNumber" label="Mobile Number" validate={[required()]} />
            <TextInput source="address.street" label="Street" />
            <TextInput source="address.buildingName" label="Building" />
            <TextInput source="address.city" label="City" />
            <TextInput source="address.state" label="State" />
            <TextInput source="address.country" label="Country" />
            <TextInput source="address.pincode" label="Pincode" />
        </SimpleForm>
    </Create>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="userId" />
            <TextInput source="firstName" validate={[required()]} />
            <TextInput source="lastName" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="mobileNumber" validate={[required()]} />
            <TextInput source="address.street" label="Street" />
            <TextInput source="address.buildingName" label="Building" />
            <TextInput source="address.city" label="City" />
            <TextInput source="address.state" label="State" />
            <TextInput source="address.country" label="Country" />
            <TextInput source="address.pincode" label="Pincode" />
        </SimpleForm>
    </Edit>
);
