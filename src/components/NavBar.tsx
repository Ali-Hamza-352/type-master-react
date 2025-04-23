
import { useAuth } from "@/hooks/useAuth";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">TypingMaster</span>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link 
                to="/" 
                className={navigationMenuTriggerStyle()}
              >
                Home
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user?.username}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
