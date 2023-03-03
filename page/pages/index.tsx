import type { NextPage } from 'next'
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import io from "socket.io-client";

import Head from 'next/head'
import Draw from "./components/draw"
import Selector from "./components/selector"

import styles from './styles/index.module.scss'
import { get_data } from "../lib/get"
import { getUrl } from "../lib/main"
import { DataToUrl, UrlToData } from "../lib/data"
import axios from 'axios';

let socket = io(getUrl("","ws"))

type generate = {
    data: Array<string>,
    x: number,
    y: number
}

const Home: NextPage = () => {
    async function get() {
        const res = await get_data();
        if(res) {
            changeData(res.data)
            setSizeX(res.sizeX)
            setSizeY(res.sizeY)
        }
        console.log(res)
    }
    const reset_list = (x:number, y:number, color:string) => {
        let r = []
        for (let i = 0; i < x*y; i++) {
            r.push(color)
        }
        return r
    }
    
    const Generate2Array = (generate: string): generate  => {
        const arr = generate.split("\n")
        if(!arr[0])
            arr.shift()
        console.log(arr)
        const data = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                data.push(arr[i][j] == "0" ? "#fff": "#000");
            }
        }
        const x = arr[0].length
        if(data.length < x * x) {
            for(let i = 0; i < (x * x - data.length); i++) {
                data.push("#fff")
            }
        }
        return {
            data: data,
            x: arr[0].length,
            //x: 16,
            y: arr[0].length
            //y: 16
        }
    }
    //console.log(Generate2Array("000000\n001100\n001100\n000000"))
    const [sizeX,setSizeX] = useState(32)
    const [sizeY,setSizeY] = useState(32)
    const [list, setData] = useState(reset_list(sizeX, sizeY, "#fff"))
    const [color, setColor] = useState("#000")
    const [colors, setColors] = useState(["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#78909C","#fff","#E0E0E0","#BDBDBD","#9E9E9E","#424242","#212121","#000"])
    const [canMove, setCanMove] = useState(true)
    const [aiCommand, setAiCommand] = useState("")
    const router = useRouter()
    const t = () => {
        socket.on("json", (d:any) => {
            changeData(d.data)
            setSizeX(d.sizeX)
            setSizeY(d.sizeY)
        })
    }
    const changeData = (data:string) => {
        if(!data) return
        setData(UrlToData(data))
    }
    t()
    useEffect(() => {
        get()
    },[])
    useEffect(() => {
        if(router.query.data && router.query.x && router.query.y) {
            socket.emit("json", {"data":router.query.data,"sizeX":Number(router.query.x), "sizeY":Number(router.query.y)})
            return
        }
        if(router.query.x && router.query.y) {
            socket.emit("json", {"data":DataToUrl(reset_list(Number(router.query.x),Number(router.query.y),"#fff")),"sizeX":Number(router.query.x), "sizeY":Number(router.query.y)})
            return
        }
        if(router.query.data && !Array.isArray(router.query.data)) {
            socket.emit("json", {"data":router.query.data})
        }
    },[router.query])
    return (
        <div className={styles.main}>
            <Head>
                <title>Editor</title>
            </Head>
            <div style={{
                margin: 20,
                display: "flex"
            }}>
                <input style={{
                    width: 256,
                    height: 42,
                    border: "none",
                    borderRadius: 6,
                    fontSize: 16,
                    paddingLeft: 12,
                    marginRight: 6
                }} placeholder="command" onChange={(e: any)=> setAiCommand(e.target.value)} value={aiCommand} type="text" />
                <button style={{
                    width: 42,
                    height: 42,
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                }} onClick={async()=> {
                    setAiCommand("")
                    const res = await axios.post(getUrl("/ai"), {
                        body: JSON.stringify({
                            command: aiCommand
                        })
                    })
                    console.log(res)
                    //const res = {"data":"\n0000000011111111\n0000000111111111\n0000001111111111\n0000011111111111\n0000111111111111\n0001111111111111\n0011111111111111\n0011111111111111\n0111111111111111\n0111111111111111\n0011111111111111\n0011111111111111\n0001111111111111\n0000111111111111\n0000011111111111\n0000001111111111\n0000000111111111\n0000000011111111"}
                    const data = Generate2Array(res.data.data)
                    console.log(res, data)
                    setData(data.data)
                    setSizeX(data.x)
                    setSizeY(data.y)
                    socket.emit("json", {"data":DataToUrl(data.data),"sizeX": data.x, "sizeY": data.y})
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-writing" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" />
                      <path d="M16 7h4" />
                      <path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" />
                    </svg>
              </button>
            </div>
            <div className={styles.canvas}>
                <TransformWrapper
                minScale={0.1}
                disabled={!canMove}
                limitToBounds={false}
                >
                    <TransformComponent>
                        <Draw x={sizeX} y={sizeY} data={list} color={color} setData={setData} move={setCanMove}/>
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <Selector setColor={setColor} colors={colors} now={color} />
        </div>
    )
}
export default Home
