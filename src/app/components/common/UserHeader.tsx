import InputField from "./input-field/InputField";
import PrimaryButton from "./primary-button/PrimaryButton";

const UserHeader = (props: any) => {
    const { title, setSearchTerm, handleSearchUser } = props;
    return (
        <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-dark-900 mb-2">{title}</h1>
            <div className="flex items-center gap-2">
            <InputField
                name='email'
                placeholder='Search by name , email or phone number'
                isRequired={true}
                onChange={(e: any) => {
                    const value = e?.target?.value;
                    setSearchTerm(value);
                }}
            />
            <PrimaryButton label="Search" onClick={handleSearchUser} />
            </div>
        </div>
    );
};

export default UserHeader;