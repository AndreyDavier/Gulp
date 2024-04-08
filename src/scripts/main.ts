class Person {
    constructor(
        private readonly name: string,
        private readonly age: string,
        private readonly salary: string

    ) { }

    public toString(): string {
        return `Имя ${this.name} ${this.age} ${this.salary}`
    }
}