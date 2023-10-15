import { useSession} from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import router from "next/router";
import { BellSVG } from "../reusables/svgstroke";
import { handleMutationError } from "~/utils/error-handling";

export const NotificationMenu = () => {
  const { data: session } = useSession();
  const { data: notificationData, isLoading: notificationLoading } = api.notification.getUserNotifications.useQuery({userId: session!.user.id});
  
  const unreadNotificationCount = notificationData ? notificationData.filter(notification => !notification.read).length : 0;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<null | HTMLDivElement>(null);

  const redirectNotification = (url: string | null) => {
    toggleNotifDropdown();
    if (url != null)
        router.push(url).catch(err => {
            // Handle any errors that might occur during the navigation
            console.error('Failed to redirect:', err);
        });
    };


  // User Drop Down Event 
  const onClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };
  const { readAllNotifications } = UseNotificationsMutations();

  const toggleNotifDropdown = (e?: React.MouseEvent) => {
      if (e){
        e.stopPropagation();
      }
      if (!showDropdown && session) { // If dropdown is currently closed and there's a session
          readAllNotifications(session.user.id).catch(err => {
              console.error('Failed to set notifications to read:', err);
          });
      }
    if (showDropdown) {
      window.removeEventListener('click', onClickOutside);
    } else {
      // Delay adding the event listener to allow for the current event to complete
      setTimeout(() => {
        window.addEventListener('click', onClickOutside);
      }, 0);
    }
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);

  return ( 
        <div>
        {session && (
            <div className="relative">
                <div 
                    id="notifdropdown"
                    onClick={toggleNotifDropdown} 
                    className="rounded-full border-2 p-1 border-slate-300 flex justify-center items-center relative"
                    style={{ cursor: 'pointer' }}
                >
                    <BellSVG width="5" height="5" colorStrokeHex="#0369a1"></BellSVG>
                    
                    {/* Counter for unread notifications */}
                    {unreadNotificationCount != 0 && (
                    <div 
                        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                        {/* You'll need to compute this value based on your data */}
                        {unreadNotificationCount}
                    </div>
                    )}
                </div>
                
                {showDropdown && (
                    <div ref={dropdownRef} className="absolute mt-0 w-96 -right-40 border border-slate-300 z-30 rounded-md shadow-lg">
                        {notificationData && notificationData.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`w-full text-left p-3 border-b hover:bg-slate-200 ${notification.read ? 'bg-white' : 'bg-sky-100'}`}
                                onClick={() => redirectNotification(notification.link)}
                                style={{ cursor: 'pointer' }}
                                >
                                {notification.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
     </div>
  )
} 

export const UseNotificationsMutations = () => {
    const apiContext = api.useContext();
    const handleSuccess = async () => {
        await apiContext.notification.getUserNotifications.invalidate();
    };

    const { mutate: readAllNotificationsMutation } = api.notification.readAllNotification.useMutation({
        onSuccess: handleSuccess,
    });

    const readAllNotifications = (userId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            readAllNotificationsMutation({ userId: userId }, {
                onSuccess: (data, variables) => {
                    resolve();
                },
                onError: (e) => {
                    handleMutationError(e, reject);
                }
            });
        });
    };

    return {
        readAllNotifications,
    };
}