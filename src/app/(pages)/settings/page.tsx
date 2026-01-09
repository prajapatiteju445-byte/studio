'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestThresholds } from '@/ai/flows/suggest-thresholds';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const characteristicsSchema = z.object({
  age: z.coerce.number().min(13, 'Must be at least 13').max(100),
  activityLevel: z.enum(['sedentary', 'active', 'very active']),
  deviceType: z.enum(['phone', 'watch']),
});

const settingsSchema = z.object({
  voiceAnalysis: z.boolean(),
  triggerWords: z.string(),
  movementAnalysis: z.boolean(),
  accelerometer: z.number(),
  gyroscope: z.number(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const [suggestedThresholds, setSuggestedThresholds] = useState<{
    accelerometer: number;
    gyroscope: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const characteristicsForm = useForm<z.infer<typeof characteristicsSchema>>({
    resolver: zodResolver(characteristicsSchema),
    defaultValues: { age: 25, activityLevel: 'active', deviceType: 'phone' },
  });

  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    defaultValues: {
      voiceAnalysis: true,
      triggerWords: 'Help me, Danger, Emergency',
      movementAnalysis: true,
      accelerometer: 2.5,
      gyroscope: 300,
    },
  });

  async function onGetSuggestions(
    values: z.infer<typeof characteristicsSchema>
  ) {
    setIsLoading(true);
    setSuggestedThresholds(null);
    try {
      const result = await suggestThresholds(values);
      setSuggestedThresholds({
        accelerometer: result.accelerometerThreshold,
        gyroscope: result.gyroscopeThreshold,
      });
      settingsForm.setValue('accelerometer', result.accelerometerThreshold);
      settingsForm.setValue('gyroscope', result.gyroscopeThreshold);
      toast({
        title: 'Suggestions Ready!',
        description: 'AI-powered thresholds have been generated for you.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get suggestions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onSettingsSave(values: z.infer<typeof settingsSchema>) {
    console.log(values);
    toast({
      title: 'Settings Saved',
      description: 'Your distress detection settings have been updated.',
    });
  }
  
  const accelerometerValue = settingsForm.watch('accelerometer');
  const gyroscopeValue = settingsForm.watch('gyroscope');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your distress detection and other preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">AI Suggestions</CardTitle>
              <CardDescription>
                Provide some details to get AI-powered threshold suggestions.
              </CardDescription>
            </CardHeader>
            <Form {...characteristicsForm}>
              <form
                onSubmit={characteristicsForm.handleSubmit(onGetSuggestions)}
              >
                <CardContent className="space-y-4">
                  <FormField
                    control={characteristicsForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={characteristicsForm.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typical Activity Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="very active">
                              Very Active
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={characteristicsForm.control}
                    name="deviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Device</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select device type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="watch">Watch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Get Suggestions
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSave)}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Distress Detection</CardTitle>
                  <CardDescription>
                    Configure how the app detects a potential emergency.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={settingsForm.control}
                    name="voiceAnalysis"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Voice Analysis</FormLabel>
                          <FormDescription>
                            Listen for trigger words in real-time.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="triggerWords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger Words</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Help me, Danger" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated words or phrases that will activate an alert.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="movementAnalysis"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Movement Analysis</FormLabel>
                          <FormDescription>
                            Use device sensors to detect sudden movements.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="space-y-6">
                    <FormField
                      control={settingsForm.control}
                      name="accelerometer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accelerometer Threshold ({accelerometerValue.toFixed(2)} g)</FormLabel>
                          <FormControl>
                            <Slider
                              min={1} max={8} step={0.1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                           <FormDescription>Sensitivity to sudden movements like falling or impacts.</FormDescription>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={settingsForm.control}
                      name="gyroscope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gyroscope Threshold ({gyroscopeValue.toFixed(0)} deg/s)</FormLabel>
                          <FormControl>
                            <Slider
                              min={100} max={1000} step={10}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>Sensitivity to rapid rotations or struggles.</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Settings</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
