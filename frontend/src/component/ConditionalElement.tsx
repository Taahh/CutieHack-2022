import { FC, Fragment, ReactElement } from "react";

const ConditionalElement: FC<{condition: boolean, element: ReactElement}> = (props) => {
    if (props.condition) {
        return (
            <Fragment />
        )
    }
    return props.element
}

export default ConditionalElement