import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Head from 'next/head'
import Draw from "./components/draw"

import { UrlToData } from "../lib/data"

import styles from './styles/index.module.scss'

const View: NextPage = () => {
    const [sizeX,setSizeX] = useState(32)
    const [sizeY,setSizeY] = useState(32)
    const [size,setSize] = useState(32)
    const [background,setBackground] = useState("#2c3e50")
    const [list, setData]:any = useState([])
    const [color, setColor] = useState("#000")
    const [canMove, setCanMove] = useState(true)
    const router = useRouter()
    useEffect(() => {
        if(router.query.x && router.query.y) {
            setSizeX(Number(router.query.x))
            setSizeY(Number(router.query.y))
        }
        if(router.query.data && !Array.isArray(router.query.data)) {
            setData(UrlToData(router.query.data))
        }
        if(router.query.size) {
            setSize(Number(router.query.size))
        }
        if(router.query.background) {
            setBackground("#"+router.query.background)
        }
    },[router.query])
    return (
        <div className={styles.main} style={{ background:background}}>
            <Head>
                <title>Editor</title>
            </Head>
            <div className={styles.canvas}>
                <TransformWrapper
                minScale={0.1}
                disabled={false}
                limitToBounds={true}
                >
                    <TransformComponent>
                        <Draw x={sizeX} y={sizeY} data={list} color={color} size={size} move={setCanMove} draw={false}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    )
}
export default View
