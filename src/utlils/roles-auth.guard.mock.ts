import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { AuthGuard } from "@nestjs/passport";
import { UserType } from "../common/enums/user.enum";

class MockRolesAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredUserTypes = this.reflector.get<UserType[]>('roles', context.getHandler());

        if (!requiredUserTypes) {
            return true; // No roles defined, allow access
        }

        // Simulate authentication
        const isAuthenticated = true; // Simulate authenticated user

        if (!isAuthenticated) {
            throw new UnauthorizedException('Authentication failed');
        }

        const user = context.switchToHttp().getRequest().user;

        if (requiredUserTypes.includes(UserType.Owner)) {
            // Simulate "owner" roles for create, update, and delete
            if (user.userType === UserType.Owner) {
                return true;
            }
        }

        if (requiredUserTypes.includes(UserType.Renter)) {
            // Simulate both "owner" and "renter" roles for read
            if ([UserType.Owner, UserType.Renter].includes(user.userType)) {
                return true;
            }
        }

        throw new UnauthorizedException('Insufficient role');
    }
}

export const mockAuthGuard = {
    canActivate: jest.fn((context) => new MockRolesAuthGuard({} as Reflector).canActivate(context)),
};
