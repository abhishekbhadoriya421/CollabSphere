export default class UserLoginDetail {
    private static user_id: number | null;
    private static username: string | '';
    private static email: string | '';

    public static setUserDetails(user_id: number, username: string, email: string): void {
        this.email = email;
        this.user_id = user_id;
        this.username = username
    }

    public static getUserDetails(): UserLoginDetail {
        return {
            user_id: this.user_id,
            email: this.email,
            username: this.username
        }
    }

    public static getUserId(): number | null {
        return this.user_id;
    }
}