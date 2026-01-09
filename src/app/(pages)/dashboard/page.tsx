import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { communityReports, emergencyContacts } from '@/lib/data';
import { MapPin, Users, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const safetyMapImage = PlaceHolderImages.find((img) => img.id === 'safety-map');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is your safety overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsafe Area Reports</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communityReports.length}</div>
            <p className="text-xs text-muted-foreground">reports from the community</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencyContacts.length}</div>
            <p className="text-xs text-muted-foreground">people in your safety circle</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No active alerts in your area</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Real-Time Safety Map</CardTitle>
            <CardDescription>Reported incidents and unsafe areas are marked on the map.</CardDescription>
          </CardHeader>
          <CardContent>
            {safetyMapImage && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border">
                <Image
                  src={safetyMapImage.imageUrl}
                  alt={safetyMapImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={safetyMapImage.imageHint}
                />
                 <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></div>
                 <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-white"></div>
                 <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Community Reports</CardTitle>
            <CardDescription>Latest incidents reported by the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {communityReports.slice(0, 3).map((report) => (
                <li key={report.id} className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                     <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{report.description}</p>
                    <Badge variant="secondary" className="mt-1">Community Report</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
