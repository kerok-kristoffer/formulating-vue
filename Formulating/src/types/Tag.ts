class Tag {

    public isActive :boolean = false;

    constructor(
        public id: number,
        public name: string
    ) {

    }

    equals(tag: Tag) {
        return tag.name === this.name;
    }
}

export default Tag