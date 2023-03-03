import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Head from 'next/head'
import Draw from "./components/draw"
import Selector from "./components/selector"

import { UrlToData } from '../lib/data';

import styles from './styles/index.module.scss'

const Home: NextPage = () => {
    const reset_list = (x:number, y:number, color:string) => {
        let r = []
        for (let i = 0; i < x*y; i++) {
            r.push(color)
        }
        return r
    }
    const [sizeX,setSizeX] = useState(32)
    const [sizeY,setSizeY] = useState(32)
    const [size, setSize] = useState(32)
    const [list, setData] = useState(reset_list(sizeX, sizeY, "#fff"))
    const [color, setColor] = useState("#000")
    const [colors, setColors] = useState(["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#78909C","#fff","#E0E0E0","#BDBDBD","#9E9E9E","#424242","#212121","#000"])
    const [canMove, setCanMove] = useState(true)
    const router = useRouter()
    useEffect(() => {
        if(router.query.x && router.query.y) {
            setSizeY(Number(router.query.y))
            setSizeX(Number(router.query.x))
            setData(reset_list(Number(router.query.x), Number(router.query.y), "#fff"))
        }
        if(router.query.data && !Array.isArray(router.query.data)) {
            setData(UrlToData(router.query.data))
        }
        if(router.query.size) {
            setSize(Number(router.query.size))
        }
    },[router.query])
    return (
        <div className={styles.main}>
            <Head>
                <title>Editor</title>
            </Head>
            <div className={styles.canvas}>
                <TransformWrapper
                minScale={0.1*(32/size)}
                disabled={!canMove}
                limitToBounds={false}
                >
                    <TransformComponent>
                        <Draw x={sizeX} y={sizeY} data={list} color={color} move={setCanMove} setData={setData} offline={true} size={size}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <Selector setColor={setColor} colors={colors} now={color} />
        </div>
    )
}
export default Home
