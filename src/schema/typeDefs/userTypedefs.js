export default `#graphql

scalar Number

type User {
    userName: String
    gender: Gender
    age: Number
    profilePicture:String
    email:String
    password:String
}

enum Gender {
    FEMALE
    MALE
    Female
    Male
    female
    male
}

type Query {
    allUser: [User]
}

input userInput {
    userName: String
    gender: Gender
    age: Number
    profilePicture:String
    email:String
    password:String
}

type Mutation {
    regiseterUser(input: userInput): User
    updateUser(id:ID, input: userInput): User
    deleteUser(id:ID):User
}

`;
