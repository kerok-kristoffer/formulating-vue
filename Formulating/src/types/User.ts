
class User {
  constructor(
    public name: string,
    public email: string,
    public fullName: string,
    public createdAt: Date,
    public accessToken: string,
    public refreshToken: string,
    public StripeCustomerId: string,
  ) {}

}

export default User;