import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = (user: User) => {
    return {
      id: user.id,
      username: user.username,
      firstName:user.firstName,
      lastName:user.lastName,
      imageUrl: user.imageUrl
    }
}