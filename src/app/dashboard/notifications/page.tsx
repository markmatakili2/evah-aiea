
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </CardTitle>
        <CardDescription>
          Here's a list of your recent notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {mockNotifications.map((notification) => (
            <Link key={notification.id} href={notification.href}>
              <div
                className={cn(
                  "flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50",
                  !notification.read && "bg-accent/10 border-accent/50"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <notification.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className={cn("font-medium", !notification.read && "text-primary")}>
                    {notification.text}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                    <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
            <Button variant="ghost">Mark all as read</Button>
        </div>
      </CardContent>
    </Card>
  );
}
