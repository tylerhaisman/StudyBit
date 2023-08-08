class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  school: string;
  isAdmin: boolean;
  constructor({
    id,
    email,
    password,
    firstName,
    lastName,
    school,
    isAdmin,
  }: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    school: string;
    isAdmin: boolean;
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.school = school;
    this.isAdmin = isAdmin;
  }
}

export default User;
