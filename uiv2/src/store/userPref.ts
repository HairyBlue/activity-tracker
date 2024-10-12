
import { defineStore } from 'pinia';
import {ref} from "vue";



export const userPreference = defineStore('userPreference', function () {
    const localPref: any = localStorage.getItem("activity_tracker_pref")
    const prefs = ref<any>({})

    let tempRef = {} as any

    if (localPref) {
        tempRef = JSON.parse(localPref)
        prefs.value = tempRef
    }

    function save() {
        localStorage.setItem("activity_tracker_pref", JSON.stringify(prefs.value))
    }

    function setValue(path: string, value: any) {
        let [root, child] = path.split(".")

        if (!prefs.value[root]) {
            prefs.value[root] = {}
        }

        prefs.value[root][child] = value
        save()
    }

    function getValue(path: string, value: any) {
        let [root, child] = path.split(".")
      
        if (tempRef[root]) {
            if (tempRef[root][child]) {
                return tempRef[root][child]
            }   
        }
        
        return value
    }

    return {
        setValue,
        getValue
     }
})

// "overview.chart"
// "overview.countOrPct"
// "overview.year"
// "overview.semester"