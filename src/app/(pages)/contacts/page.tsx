'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { reasonAboutNotificationMethods } from '@/ai/flows/reason-about-notification-methods';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { emergencyContacts } from '@/lib/data';
import type { EmergencyContact } from '@/lib/types';
import { Loader2, MessageSquare, Phone, Send, UserPlus, Wand2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type NotificationSuggestion = {
  name: string;
  notificationMethods: string[];
  reasoning: string;
};

export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>(emergencyContacts);
  const [situation, setSituation] = useState('');
  const [suggestions, setSuggestions] = useState<NotificationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!situation.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please describe the situation.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await reasonAboutNotificationMethods({
        contacts: contacts.map(c => ({
          name: c.name,
          phoneNumber: c.phone,
          hasAppInstalled: c.hasApp,
        })),
        situationDescription: situation,
      });
      setSuggestions(result.contactNotificationMethods);
    } catch (error) {
      console.error('Error getting notification suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to get notification suggestions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline tracking-tight">Emergency Contacts</h1>
        <p className="text-muted-foreground">Manage your safety circle and plan your emergency alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Your Safety Circle</CardTitle>
              <CardDescription>
                These contacts will be notified in an emergency.
              </CardDescription>
            </div>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <Avatar>
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    {contact.hasApp && (
                      <Badge variant="secondary" className="mt-1">
                        App User
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">AI Notification Planner</CardTitle>
            <CardDescription>
              Describe a potential situation, and our AI will suggest the best way to notify your contacts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'I'm walking home alone at night and feel like I'm being followed.'"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="resize-none"
            />
            <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold">Suggested Actions:</h3>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold">{suggestion.name}</p>
                    <div className="flex flex-wrap gap-2 my-2">
                      {suggestion.notificationMethods.map((method) => (
                        <Badge key={method} variant="outline" className="flex items-center gap-1.5">
                          {method.toLowerCase() === 'sms' && <MessageSquare className="h-3 w-3" />}
                          {method.toLowerCase().includes('push') && <Send className="h-3 w-3" />}
                          {method.toLowerCase().includes('call') && <Phone className="h-3 w-3" />}
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{suggestion.reasoning}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
