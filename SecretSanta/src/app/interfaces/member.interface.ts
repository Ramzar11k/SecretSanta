export interface IMember {
    id: string,
    name: string,
    email: string,
    ignoredMembers: IMember[]
}