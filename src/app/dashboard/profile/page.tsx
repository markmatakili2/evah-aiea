
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUserProfile } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold font-headline">Profile Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden">
                        <Image src={mockUserProfile.imageUrl} alt="User Avatar" fill className="object-cover" data-ai-hint={mockUserProfile.imageHint}/>
                    </div>
                    <Button variant="outline">Change Photo</Button>
                </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue={mockUserProfile.firstName} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input id="surname" defaultValue={mockUserProfile.surname} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={mockUserProfile.email} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue={mockUserProfile.dob} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={mockUserProfile.phone} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue={mockUserProfile.gender.toLowerCase()}>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={mockUserProfile.address.line1} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City/Town</Label>
                    <Input id="city" defaultValue={mockUserProfile.address.city} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue={mockUserProfile.address.country} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Allow Location Access</Label>
                    <div className="flex items-center space-x-2 h-10">
                        <Switch id="location-access" defaultChecked={mockUserProfile.allowLocation} />
                        <Label htmlFor="location-access" className="text-sm text-muted-foreground">Enable to find nearby labs easily</Label>
                    </div>
                </div>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                    Choose a strong new password to protect your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Update Password</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
