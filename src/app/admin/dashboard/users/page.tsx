
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Search, filter, and manage all users on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>User filtering and management tools will be here.</p>
      </CardContent>
    </Card>
  );
}
