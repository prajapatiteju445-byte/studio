'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { summarizeIncidentReports } from '@/ai/flows/summarize-incident-reports';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { communityReports } from '@/lib/data';
import { Loader2, Wand2 } from 'lucide-react';

const reportSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Please provide a more detailed description.'),
});

function ReportIncidentForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { location: '', description: '' },
  });

  function onSubmit(values: z.infer<typeof reportSchema>) {
    console.log(values);
    toast({
      title: 'Report Submitted',
      description: "Thank you for helping keep the community safe.",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Elm Street Park" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Incident</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you observed..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit Report
        </Button>
      </form>
    </Form>
  );
}

function IncidentSummary() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeIncidentReports({
        areaDescription: 'Downtown City Center',
        incidentReports: communityReports.map((r) => r.description),
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate incident summary.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate AI Summary for Downtown
        </Button>
      </div>

      {isLoading && (
         <div className="space-y-2">
            <div className="animate-pulse bg-muted rounded-md h-6 w-1/2"></div>
            <div className="animate-pulse bg-muted rounded-md h-6 w-full"></div>
            <div className="animate-pulse bg-muted rounded-md h-6 w-3/4"></div>
        </div>
      )}

      {summary && (
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Wand2 />
              AI-Powered Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">{summary}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-headline text-lg">Recent Reports for Downtown</h3>
        <ul className="space-y-2">
          {communityReports.map((report) => (
            <li key={report.id} className="p-3 bg-muted/50 rounded-md text-sm">
              {report.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Community Hub</h1>
        <p className="text-muted-foreground">Report incidents and stay informed about your area.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Report an Unsafe Area</CardTitle>
            <CardDescription>
              Help others by reporting incidents or areas that feel unsafe. Your contributions make the community safer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportIncidentForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Community Incident Summary</CardTitle>
            <CardDescription>
              Get an AI-powered summary of recent incident reports for a specific area to quickly understand potential risks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
