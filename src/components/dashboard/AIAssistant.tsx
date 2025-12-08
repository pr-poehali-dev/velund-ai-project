import { useState, useRef } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_URL = 'https://functions.poehali.dev/b24c5b05-f128-4d2c-9b06-d2e9aed4eddf';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    size: number;
  };
}

interface AIAssistantProps {
  onSupplierAdd?: () => void;
}

const AIAssistant = ({ onSupplierAdd }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я Velund AI - ваш умный помощник. Могу помочь найти поставщиков, ответить на вопросы о ценах или добавить нового поставщика из файла. Просто напишите запрос или загрузите прайс-лист!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiSuggestions = [
    'Кто в Казани продает швеллер 12П?',
    'Средняя цена на лист 09Г2С 4мм?',
    'Покажи топ поставщиков нержавейки',
    'Добавить нового поставщика'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/pdf',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Неподдерживаемый формат', {
        description: 'Загрузите файл Excel, PDF или CSV'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Файл слишком большой', {
        description: 'Максимальный размер файла - 10 МБ'
      });
      return;
    }

    setUploadedFile(file);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Загрузил файл: ${file.name}`,
      timestamp: new Date(),
      file: {
        name: file.name,
        size: file.size
      }
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Вижу файл "${file.name}". Это выглядит как прайс-лист поставщика. Хотите добавить поставщика в базу данных? Нажмите "Да" для отправки на модерацию администратору.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleConfirmUpload = async () => {
    if (!uploadedFile) return;

    setLoading(true);

    const user = localStorage.getItem('velund_user');
    const userData = user ? JSON.parse(user) : null;

    if (!userData?.id) {
      toast.error('Необходимо авторизоваться');
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userData.id.toString()
          },
          body: JSON.stringify({
            company_name: uploadedFile.name.replace(/\.(xlsx|xls|pdf|csv)$/i, ''),
            description: `Загружен файл: ${uploadedFile.name}`,
            file_name: uploadedFile.name,
            file_data: base64
          })
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Ошибка загрузки');
          setLoading(false);
          return;
        }

        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '✅ Отлично! Файл отправлен администратору на модерацию. После одобрения я автоматически распарсю файл и добавлю поставщика с товарами в базу данных. Вы получите уведомление!',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, confirmMessage]);
        setUploadedFile(null);
        
        toast.success('Файл отправлен на модерацию!', {
          description: 'Администратор проверит данные'
        });

        if (onSupplierAdd) onSupplierAdd();

        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      };

      reader.onerror = () => {
        toast.error('Ошибка чтения файла');
        setLoading(false);
      };

    } catch (error) {
      toast.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const mockResponses = [
        'Нашел 3 поставщика в Казани, которые продают этот товар. Средняя цена: 58 000 ₽/тонна.',
        'Средняя цена на лист 09Г2С 4мм в Москве составляет 67 000 ₽/тонна по данным из базы.',
        'Топ-3 прямых поставщика нержавейки: СталПром (Казань), МеталлТрейд (Москва), ПрокатСервис (СПб).',
        'Для добавления нового поставщика загрузите прайс-лист (Excel, PDF или CSV файл) через кнопку прикрепления.'
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  return (
    <Card className="bg-dark-lighter border-gold/20 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Icon name="Bot" className="w-6 h-6" />
          AI Ассистент Velund
        </CardTitle>
        <CardDescription className="text-silver">
          Ваш умный помощник: поиск поставщиков, анализ цен, загрузка прайсов
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" className="w-4 h-4 text-dark" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gold/20 border border-gold/30 text-foreground'
                      : 'bg-dark border border-gold/10 text-silver'
                  }`}
                >
                  {message.file && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-dark/50 rounded">
                      <Icon name="FileText" className="w-4 h-4 text-gold" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{message.file.name}</p>
                        <p className="text-xs text-silver">
                          {(message.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-silver/50 mt-1">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-silver to-silver/70 flex items-center justify-center flex-shrink-0">
                    <Icon name="User" className="w-4 h-4 text-dark" />
                  </div>
                )}
              </div>
            ))}

            {uploadedFile && (
              <div className="flex justify-center">
                <Button
                  onClick={handleConfirmUpload}
                  disabled={loading}
                  className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" className="w-4 h-4 mr-2" />
                      Да, отправить на модерацию
                    </>
                  )}
                </Button>
              </div>
            )}

            {loading && !uploadedFile && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" className="w-4 h-4 text-dark" />
                </div>
                <div className="bg-dark border border-gold/10 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </div>

        <div className="space-y-2 border-t border-gold/10 pt-4">
          <div className="flex flex-wrap gap-1">
            {aiSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                className="border-gold/20 text-silver hover:bg-gold/10 hover:text-gold text-xs h-7"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.pdf,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="icon"
              className="border-gold/30 text-gold hover:bg-gold/10 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Icon name="Paperclip" className="w-4 h-4" />
            </Button>

            <Input
              placeholder="Напишите запрос или загрузите файл..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="bg-dark border-gold/20 focus:border-gold text-foreground"
              disabled={loading}
            />

            <Button
              size="icon"
              className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale flex-shrink-0"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <Icon name="Send" className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-silver/70 text-center">
            Поддерживаются файлы: Excel (.xlsx, .xls), PDF, CSV
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;