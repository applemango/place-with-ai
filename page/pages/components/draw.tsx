import React from "react"
import { useState } from "react"
import {useEffect, useRef} from 'react';
import { useRouter } from 'next/router'

import io from "socket.io-client";

import { getUrl } from "../../lib/main"

import { DataToUrl } from "../../lib/data"

let socket = io(getUrl("","ws"))

type Props = {
    data: Array<any>
    color: string
    x: number
    y: number
    move: Function
    draw?: boolean
    setData?: Function
    offline?: boolean
    size?: number
}
const Draw = ({ x, y, data, color, move, draw = true, setData, offline = false, size = 32 }:Props) => {
    const [md, setMd] = useState(false)
    const [hover, setHover] = useState(false)
    const [mousePosition, setMousePosition] = useState(-1)
    const [download, setDownload] = useState("")
    const [url, setUrl] = useState("")
    const [nowLocation, setNowLocation] = useState("")
    const canvasRef = useRef(null);
    const router = useRouter()
    const getContext = (): CanvasRenderingContext2D => {
        const canvas: any = canvasRef.current;
        return canvas.getContext('2d');
    };
    const getPosition = (e: React.MouseEvent<HTMLElement>):number => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const scale = width / (size * x)
        const mouseX = e.clientX - left
        const mouseY = e.clientY - top
        const X = Math.floor(mouseX / scale / size)
        const Y = Math.floor(mouseY / scale / size)
        const Position = Y * y + X
        return Position
    }
    const change_dot = (i:number, color:string):void => {
        if(!setData) return
        setData(
            data.map((d:any, index:number) => (
                index == i ? color : d
            ))
        )
    }
    const getDataUrl = ():void => {
        const canvas: any = canvasRef.current;
        setDownload(canvas.toDataURL("image/png"))
    }
    const draw_color = (index: number):void => {
        if(!draw) return
        change_dot(index, color)
    }
    useEffect(() => {
        const ctx: CanvasRenderingContext2D = getContext();
        const lw = 4
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                ctx.fillStyle = data[i*y+j]
                ctx.fillRect(j*size,i*size,size,size)
                if(draw && hover && mousePosition == i*y+j) {
                    ctx.lineWidth = lw
                    ctx.strokeStyle = color == data[i*y+j] ? "#fff" == data[i*y+j] ? "#000" : "#fff" : color
                    ctx.strokeRect(j*size+Math.floor(lw/2),i*size+Math.floor(lw/2),size-lw,size-lw)
                }
            }
        }
    })
    useEffect(() => {
        setNowLocation(location.origin)
    },[])
    return (
        <div>
            <a onClick={getDataUrl} href={download} download="image.png" style={{color:"#fff" ,marginRight:"15px"}}>download</a>
            <a onMouseDown={() => {setUrl(DataToUrl(data))}} href={`${nowLocation}/view?size=${size}&x=${x}&y=${y}&data=${url}`} target="_blank" rel="noopener noreferrer" style={{color:"#fff"}}>copy link</a>
            <div
            onMouseDown={() => {setMd(true)}}
            onMouseUp={() => {setMd(false)}}
            style={{
                cursor: draw ? "pointer" : "default"
            }}
            >
                <canvas
                onMouseOver={(e: React.MouseEvent<HTMLElement>):void => {
                    if(!md) return
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseMove={(e: React.MouseEvent<HTMLElement>):void => {
                    setMousePosition(getPosition(e))
                    if(!md) return
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseDown={(e: React.MouseEvent<HTMLElement>):void => {
                    move(false)
                    draw_color(getPosition(e))
                }}
                onMouseUp={() => {
                    move(true)
                    if(draw && offline) {
                        const t = DataToUrl(data)
                        const origin = location.origin
                        const path = location.pathname
                        const url = `${origin}${path}?size=${size}&x=${x}&y=${y}&data=${t}`
                        setUrl(t)
                        router.replace(url)
                    }
                    if(draw && !offline) {
                        const t = DataToUrl(data)
                        socket.emit("json", {"data":t,"sizeX":x, "sizeY":y})
                    }
                }}
                onMouseEnter={(e) => {
                    setHover(true)
                }}
                onMouseLeave={(e) => {
                    setHover(false)
                }}
                width={size*x} height={size*y} ref={canvasRef}
                />
            </div>
        </div>
    );
}
export default Draw