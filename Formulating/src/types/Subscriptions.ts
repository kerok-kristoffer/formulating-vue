// list of SubPlans that will be shown on the Subscriptions page. Get from backend and store in redux store

import SubPlan from "./SubPlan";
import axios from "axios";
import {userData} from "../stores/userData";

class Subscriptions {
    public subscriptions: SubPlan[] = [];

    // get subscription details from backend
    async populate() {
        // TODO replace direct call with api function in userData
        await axios.get('users/subscriptions').catch(error => {
            if (userData().debug) {
                console.log(error)
            }
        })
            .then((response :any) => {
                let data = response.data
                this.subscriptions = []
                for (let i in data) {
                    let sub = data[i]
                    let subscription = new SubPlan(sub.name, sub.description, sub.price, sub.duration, sub.updatedAt, sub.accessRank)
                    this.subscriptions.push(subscription)
                }
            });
    }
}
