import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Send, Users, Hash, Plus, Settings } from "lucide-react";
import { ChatChannelOld, ChatMessage } from "../types/client";
import { mockChatChannels, mockChatMessages } from "../data/mockData";

export function Chat() {
  const [channels] = useState<ChatChannelOld[]>(mockChatChannels);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [activeChannel, setActiveChannel] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState(['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const channelMessages = messages.filter(m => m.channelId === activeChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'Ja',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      channelId: activeChannel
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Dzisiaj';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    } else {
      return date.toLocaleDateString('pl-PL');
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar - Channels and Users */}
      <div className="w-64 space-y-4">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Kanały
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={activeChannel === channel.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveChannel(channel.id)}
              >
                {channel.isPrivate ? '🔒' : '#'} {channel.name}
              </Button>
            ))}
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj kanał
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Online ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {activeChannelData?.isPrivate ? '🔒' : '#'} {activeChannelData?.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {activeChannelData?.description}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {channelMessages.map((message, index) => {
                const prevMessage = channelMessages[index - 1];
                const showDate = !prevMessage || 
                  formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(message.timestamp)}
                        </Badge>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder={`Napisz wiadomość na ${activeChannelData?.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}