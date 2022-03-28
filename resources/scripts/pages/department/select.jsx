import DebounceSelect from "@/components/debounce-select";
import { useRoleActions } from "@/_actions";

const RoleSelect = ({
    ...props
}) => {
    const actions = useRoleActions();

    return (
        <DebounceSelect
            fetchOptions={actions.search}
            formater={(options) =>
                options.map((option) => ({
                    label: option.name,
                    value: option.id,
                }))
            }
            {...props}
        />
    );
};

export default RoleSelect;
