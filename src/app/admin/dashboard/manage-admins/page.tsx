
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageAdminsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Admins</CardTitle>
        <CardDescription>
          Add, edit, or remove administrators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Admin management table will be here.</p>
      </CardContent>
    </Card>
  );
}
