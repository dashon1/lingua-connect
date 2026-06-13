
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  User, 
  Globe,
  BookOpen,
  Target,
  Award
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User as UserEntity, ConversationSession, LanguageProfile } from "@/api/entities";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BookOpen,
  },
  {
    title: "Find Partners",
    url: createPageUrl("FindPartners"),
    icon: Users,
  },
  {
    title: "My Sessions", 
    url: createPageUrl("Sessions"),
    icon: Calendar,
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Vocabulary",
    url: createPageUrl("Vocabulary"),
    icon: BookOpen,
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Award,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ activeSessions: 0, partners: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);

        const activeSessions = await ConversationSession.filter({
          $or: [
            { learner_id: currentUser.id },
            { partner_id: currentUser.id }
          ],
          status: "scheduled"
        });
        
        const partners = await LanguageProfile.filter({ is_available_for_sessions: true });

        setStats({
          activeSessions: activeSessions.length,
          partners: partners.length
        });

      } catch (e) {
        // Not logged in or error fetching data, user will remain null and stats 0
        console.error("Error fetching user data or stats:", e);
        setUser(null); // Ensure user is null on error
        setStats({ activeSessions: 0, partners: 0 }); // Reset stats on error
      }
    };
    fetchData();
  }, [location.pathname]); // Re-fetch data if the path changes

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] || '') + (names[names.length - 1][0] || '');
    }
    return (name.substring(0, 2) || '').toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Sidebar className="border-r border-orange-100">
          <SidebarHeader className="border-b border-orange-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">LanguageConnect</h2>
                <p className="text-xs text-gray-500">Practice with native speakers</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Quick Info
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-600">Upcoming Sessions</span>
                    <span className="ml-auto font-semibold text-orange-600">{stats.activeSessions}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-600">Active Partners</span>
                    <span className="ml-auto font-semibold text-blue-600">{stats.partners}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-100 p-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{getInitials(user.full_name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">Welcome!</p>
                  <p className="text-xs text-gray-500 truncate">Ready to practice?</p>
                </div>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold text-gray-900">LanguageConnect</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
