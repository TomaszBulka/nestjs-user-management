import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
    
  constructor() {}

canActivate(context: ExecutionContext): boolean {
        
    const { user } = context.switchToHttp().getRequest();
    if(user && user.roles === 'admin'){
        return true;
    }  
}
}