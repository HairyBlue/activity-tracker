import {DateTime} from "luxon"
const expiration = 5 // 5 minutes

let cacheData =  {} as any

function returnCached(key: "overview" | "clubs") {
    // console.log(`Cached hit by: ${key} - ${cacheData[key]["timestamp"]}`)
    return cacheData[key]["data"]
}


function cached(key: "overview" | "clubs", data: any, query: any) {
    if (!cacheData[key]) {
        cacheData[key] = {}
    }
    cacheData[key]["data"] = data;
    cacheData[key]["timestamp"] = DateTime.now().toMillis()
    cacheData[key]["oldQuery"] = query
}


function unCached(key: "overview" | "clubs", query: any) {
    if (cacheData[key]) {

        if (cacheData[key]["oldQuery"]["year"] != query.year || cacheData[key]["oldQuery"]["semester"] != query.semester) {
            //console.log(`Uncached hit by: ${key}\n ${JSON.stringify(cacheData[key].oldQuery)}\n ${JSON.stringify(query)}`)
            return true
        }

        const expirationTime = cacheData[key].timestamp + (expiration * 60 * 1000)
        return DateTime.now().toMillis() >= expirationTime
    }

    return true
}

function handleMod() {
    //console.log("Uncached by modification")
    cacheData = {}
}

export {
    returnCached,
    cached,
    unCached,
    handleMod
}