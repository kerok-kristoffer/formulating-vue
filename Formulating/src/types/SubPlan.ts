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



// subscription plan
class SubPlan {

    expiryDate: Date;
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

    constructor(name: string, description: string, price: number, duration: number, expiryDate: Date, accessRank: AccessRank, interval: SubFrequency) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.expiryDate = expiryDate;
        this.accessRank = accessRank;
        this.frequency = interval;

    }

    static getDummySubPlans() :SubPlan[] {
        return dummySubPlans;
    }

    getSubFrequencyAsText() {

        switch(this.frequency) {
            case SubFrequency.MONTHLY:
                return "Monthly"
            case SubFrequency.YEARLY:
                return "Yearly"
            default:
                return "Unknown"
        }
    }

    // TODO kerok : add more fields like cancel button link, etc

}


let dummySubPlans = [
    new SubPlan("Freemium", "Limited access", 0, 10,  new Date('2023-12-31'),  AccessRank.FREE, SubFrequency.MONTHLY), // Unexpired freemium subscription
    new SubPlan("Freemium Expired", "No access", 0, 10, new Date('2023-12-01'), AccessRank.FREE, SubFrequency.MONTHLY), // Expired freemium subscription
    new SubPlan("Premium", "Access to all features", 9.99, 30, new Date('2024-12-01'), AccessRank.PREMIUM, SubFrequency.YEARLY), // Paid subscription
];

export default SubPlan; 