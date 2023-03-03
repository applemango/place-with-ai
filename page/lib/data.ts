import { gzipSync, unzipSync } from "zlib"
import { Buffer } from "buffer"

export function UrlToData(data: string):Array<string> {
    const d = unzip(data.replaceAll("!","AAA").replaceAll("(","H4sIAAAAAAAAA"))
    let r:string[] = []
    for (let i = 0; i < d.length; i++) {
        r.push(replaceArray(
            d[i]
            ,["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x"]
            ,["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#78909C","#fff","#E0E0E0","#BDBDBD","#9E9E9E","#424242","#212121","#000"]
        ))
    }
    return r
}
export function DataToUrl(data: Array<string>):string {
    const d = Array.from(data)
    for (let i = 0; i < d.length; i++) {
        d[i] = replaceArray(
            d[i]
            ,["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#78909C","#fff","#E0E0E0","#BDBDBD","#9E9E9E","#424242","#212121","#000"]
            ,["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x"]
            )
    }
    let r = d.toString()
    r = r.replaceAll(",","")
    r = gzip(r)
    return r
}
function replaceArray(code:string,before:Array<string>, after:Array<string>):string {
    for (let i = 0; i < before.length; i++) {
        if(code == before[i]) return after[i]
    }
    return "0"
}
function gzip(data:string):string {
    const a = data
    const b = encodeURIComponent(a)
    const c = gzipSync(b)
    const d = c.toString("base64")
    const r = d.replaceAll("/","_").replaceAll("+","-")
    const result = r.replaceAll("H4sIAAAAAAAAA","(").replaceAll("AAA","!")
    return result
}
function unzip(data:string):string {
    const a = (data).replaceAll("-","+").replaceAll("_","/")
    const b = Buffer.from(data, "base64")
    const c = unzipSync(b)
    const r = decodeURIComponent(c.toString("utf-8"))
    return r
}
//(62OywrDMAwE_1VHvdH_H6q4KUnJxoG6cxF4diVX_YCIoFcW7pHVk6-aB5XZQUb9rknxVhcB_Z1Eu7_OTHXOJBElUTQ3dngidxQYurkL0MGid3ebe7Vr4OSRPnz0-qk3Q_4TiDB3oPdAhBr6_jugQ-P6hqri42fm3h79E6v9le1_7r8AOxuyTQAE!