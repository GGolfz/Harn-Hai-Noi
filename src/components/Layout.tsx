import { Component } from "../type/Component";

interface Props {
    children: Component
}
const Layout = ({children}: Props) => {
    return (
        <div>{children}</div>
    )
}

export default Layout;