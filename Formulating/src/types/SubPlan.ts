export enum AccessRank {
    NONE = -1,
    FREE = 0,
    BASIC = 1,
    PREMIUM = 2
}

export enum SubFrequency {
    MONTHLY = 0,
    YEARLY = 1,
}

class SubPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    frequency: SubFrequency;
    duration: number;
    link: string;
    createdAt: string;
    updatedAt: string;
    accessRank: AccessRank;
    nextBillingDate: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    amount: number;
    currency: string;
    interval: string;

    constructor(
        name: string,
        description: string,
        price: number,
        duration: number,
        expiryDate: Date,
        accessRank: AccessRank,
        interval: SubFrequency,
        nextBillingDate: string,
        currentPeriodStart: string,
        currentPeriodEnd: string,
        amount: number,
        currency: string,
        intervalStr: string,
        link: string
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.accessRank = accessRank;
        this.frequency = interval;
        this.nextBillingDate = nextBillingDate;
        this.currentPeriodStart = currentPeriodStart;
        this.currentPeriodEnd = currentPeriodEnd;
        this.amount = amount;
        this.currency = currency;
        this.interval = intervalStr;
        this.link = link;
    }

    static fromResponseData(data: any): SubPlan {
        return new SubPlan(
            data.plan_name,
            '', // Assuming description is not provided in the response
            data.amount,
            0, // Assuming duration is not provided in the response
            new Date(data.current_period_end),
            AccessRank.PREMIUM, // Assuming access rank is determined elsewhere
            data.interval === 'month' ? SubFrequency.MONTHLY : SubFrequency.YEARLY,
            data.next_billing_date,
            data.current_period_start,
            data.current_period_end,
            data.amount,
            data.currency,
            data.interval,
            data.url
        );
    }

    getSubFrequencyAsText() {
        switch (this.frequency) {
            case SubFrequency.MONTHLY:
                return "Monthly";
            case SubFrequency.YEARLY:
                return "Yearly";
            default:
                return "Unknown";
        }
    }

}

export default SubPlan;