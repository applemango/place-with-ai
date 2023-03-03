import React from "react"

import styles from "./styles/selector.module.scss"


type Props = {
    setColor: any
    colors: string[]
    now?:string
}
const Selector = ({ setColor, colors, now }:Props) => {
    if(!colors) return (<div></div>)
    return (
        <div className={styles.main}>
            <div>
                { colors.map((c:string, index:number) => (
                    <div
                    key={index}
                    className={`${styles.color} ${c == now && styles.active}`}
                    style={{
                        backgroundColor: c
                    }}
                    onClick={() => {
                        setColor(c)
                    }}
                    >
                    </div>
                ))}
            </div>
    </div>
    )
}
export default Selector