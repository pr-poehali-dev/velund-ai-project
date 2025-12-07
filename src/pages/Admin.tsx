import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface PaymentRequest {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'month' | 'day';
  amount: number;
  receiptUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface UploadRequest {
  id: number;
  userId: number;
  userName: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  aiScore: number;
  aiReport: {
    type: string;
    category: string;
    itemsFound: number;
    quality: string;
    recommendation: string;
    details: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const mockPayments: PaymentRequest[] = [
    {
      id: 1,
      userId: 'user_001',
      userName: 'Иван Иванов',
      userEmail: 'ivan@example.com',
      plan: 'month',
      amount: 1200,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'pending',
      date: '2024-01-20T10:30:00'
    },
    {
      id: 2,
      userId: 'user_002',
      userName: 'Петр Петров',
      userEmail: 'petr@example.com',
      plan: 'day',
      amount: 150,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'pending',
      date: '2024-01-20T11:15:00'
    },
    {
      id: 3,
      userId: 'user_003',
      userName: 'Мария Сидорова',
      userEmail: 'maria@example.com',
      plan: 'month',
      amount: 1200,
      receiptUrl: 'https://via.placeholder.com/300x400',
      status: 'approved',
      date: '2024-01-19T14:20:00'
    }
  ];

  const mockUploadRequests: UploadRequest[] = [
    {
      id: 1,
      userId: 101,
      userName: 'ООО "СталПром"',
      fileName: 'прайс_трубы_2024.xlsx',
      uploadDate: '2024-01-22',
      status: 'pending',
      aiScore: 93,
      aiReport: {
        type: 'Прайс-лист',
        category: 'Металлопрокат: трубы',
        itemsFound: 145,
        quality: 'Отличное',
        recommendation: 'Добавить в базу',
        details: 'Обнаружено 145 позиций труб различного диаметра. Все поля заполнены корректно: артикул, размер, цена, количество. Формат стандартный.'
      }
    },
    {
      id: 2,
      userId: 102,
      userName: 'ИП Иванов А.С.',
      fileName: 'каталог_металл.pdf',
      uploadDate: '2024-01-21',
      status: 'pending',
      aiScore: 78,
      aiReport: {
        type: 'Каталог',
        category: 'Металлопрокат: смешанный',
        itemsFound: 67,
        quality: 'Хорошее',
        recommendation: 'Требуется уточнение',
        details: 'Найдено 67 позиций. Отсутствуют цены у 12 позиций. Рекомендуется запросить у поставщика обновленный прайс с ценами.'
      }
    }
  ];

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(mockPayments);
  const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>(mockUploadRequests);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleApprovePayment = (paymentId: number) => {
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'approved' as const } : payment
      )
    );
    toast.success('Платеж подтвержден!', {
      description: 'Пользователю автоматически открыт Premium доступ'
    });
  };

  const handleRejectPayment = (paymentId: number) => {
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'rejected' as const } : payment
      )
    );
    toast.error('Платеж отклонён', {
      description: 'Пользователь получит уведомление об отклонении'
    });
  };

  const handleApproveUpload = (uploadId: number) => {
    setUploadRequests(prev =>
      prev.map(upload =>
        upload.id === uploadId ? { ...upload, status: 'approved' as const } : upload
      )
    );
    toast.success('Прайс-лист одобрен!', {
      description: 'Позиции добавлены в базу поставщиков'
    });
  };

  const handleRejectUpload = (uploadId: number) => {
    setUploadRequests(prev =>
      prev.map(upload =>
        upload.id === uploadId ? { ...upload, status: 'rejected' as const } : upload
      )
    );
    toast.error('Прайс-лист отклонён', {
      description: 'Поставщик получит уведомление с рекомендациями'
    });
  };

  const filteredPayments = paymentRequests.filter(payment => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'all' || payment.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUploads = uploadRequests.filter(upload => {
    if (activeFilter === 'all') return true;
    return upload.status === activeFilter;
  });

  const stats = {
    pendingPayments: paymentRequests.filter(p => p.status === 'pending').length,
    approvedPayments: paymentRequests.filter(p => p.status === 'approved').length,
    rejectedPayments: paymentRequests.filter(p => p.status === 'rejected').length,
    totalRevenue: paymentRequests
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingUploads: uploadRequests.filter(u => u.status === 'pending').length
  };

  const planNames = {
    month: 'Месяц Безлимит',
    day: 'День Безлимит'
  };

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-border bg-dark-lighter/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center">
                <Icon name="Hammer" className="w-6 h-6 text-dark" />
              </div>
              <h1 className="text-2xl font-bold font-montserrat text-gradient-gold">
                Velund AI 5.1
              </h1>
              <Badge className="bg-gold-dark/20 text-gold-dark border-gold-dark/30">
                <Icon name="Shield" className="w-4 h-4 mr-1" />
                Админ-панель
              </Badge>
            </div>
            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" className="w-4 h-4 mr-2" />
                Главная
              </Button>
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/profile')}
              >
                <Icon name="User" className="w-4 h-4 mr-2" />
                Профиль
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gold mb-2">Панель администратора</h2>
            <p className="text-silver">Управление модерацией и платежами</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="FileText" className="w-8 h-8 text-gold" />
                  <Badge className="bg-gold/20 text-gold border-gold/30">
                    AI заявки
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gold">{stats.pendingUploads}</CardTitle>
                <CardDescription className="text-silver">На модерации</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.05s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="Clock" className="w-8 h-8 text-yellow-500" />
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    Платежи
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-yellow-500">{stats.pendingPayments}</CardTitle>
                <CardDescription className="text-silver">Ожидают проверки</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="CheckCircle" className="w-8 h-8 text-green-500" />
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Одобрено
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-green-500">{stats.approvedPayments}</CardTitle>
                <CardDescription className="text-silver">Платежей подтверждено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-red-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="XCircle" className="w-8 h-8 text-red-500" />
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Отклонено</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-red-500">{stats.rejectedPayments}</CardTitle>
                <CardDescription className="text-silver">Платежей отклонено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="DollarSign" className="w-8 h-8 text-gold" />
                  <Badge className="bg-gold/20 text-gold border-gold/30">Выручка</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gold">
                  {stats.totalRevenue.toLocaleString('ru-RU')} ₽
                </CardTitle>
                <CardDescription className="text-silver">Общий доход</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="uploads" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-dark-lighter border border-gold/20">
              <TabsTrigger
                value="uploads"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="FileText" className="w-4 h-4 mr-2" />
                Заявки AI
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="CreditCard" className="w-4 h-4 mr-2" />
                Платежи
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Users" className="w-4 h-4 mr-2" />
                Пользователи
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads" className="animate-fade-in space-y-6">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Icon name="Bot" className="w-6 h-6" />
                    AI-анализ загрузок
                  </CardTitle>
                  <CardDescription className="text-silver">
                    Заявки на модерацию прайс-листов и каталогов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={activeFilter === 'all' ? 'default' : 'outline'}
                      className={activeFilter === 'all' ? 'bg-gold text-dark' : 'border-gold/30 text-gold'}
                      onClick={() => setActiveFilter('all')}
                    >
                      Все ({uploadRequests.length})
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'pending' ? 'default' : 'outline'}
                      className={activeFilter === 'pending' ? 'bg-yellow-500 text-dark' : 'border-yellow-500/30 text-yellow-500'}
                      onClick={() => setActiveFilter('pending')}
                    >
                      На проверке ({uploadRequests.filter(u => u.status === 'pending').length})
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'approved' ? 'default' : 'outline'}
                      className={activeFilter === 'approved' ? 'bg-green-500 text-dark' : 'border-green-500/30 text-green-500'}
                      onClick={() => setActiveFilter('approved')}
                    >
                      Одобрено ({uploadRequests.filter(u => u.status === 'approved').length})
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'rejected' ? 'default' : 'outline'}
                      className={activeFilter === 'rejected' ? 'bg-red-500 text-dark' : 'border-red-500/30 text-red-500'}
                      onClick={() => setActiveFilter('rejected')}
                    >
                      Отклонено ({uploadRequests.filter(u => u.status === 'rejected').length})
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {filteredUploads.map((upload) => (
                      <Card key={upload.id} className="bg-dark border-gold/10">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-semibold text-foreground">
                                    {upload.fileName}
                                  </h4>
                                  <Badge
                                    className={
                                      upload.status === 'pending'
                                        ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                        : upload.status === 'approved'
                                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                        : 'bg-red-500/20 text-red-500 border-red-500/30'
                                    }
                                  >
                                    {upload.status === 'pending'
                                      ? 'На проверке'
                                      : upload.status === 'approved'
                                      ? 'Одобрено'
                                      : 'Отклонено'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-sm text-silver">
                                  <div className="flex items-center gap-2">
                                    <Icon name="User" className="w-4 h-4" />
                                    {upload.userName}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Icon name="Calendar" className="w-4 h-4" />
                                    {new Date(upload.uploadDate).toLocaleDateString('ru-RU')}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Icon name="Bot" className="w-4 h-4" />
                                    AI оценка: {upload.aiScore}%
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-dark-lighter rounded-lg border border-gold/20">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Icon name="Bot" className="w-5 h-5 text-gold" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-semibold text-gold mb-1">
                                    Отчёт AI-ассистента
                                  </h5>
                                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                    <div>
                                      <span className="text-silver">Тип:</span>{' '}
                                      <span className="text-foreground font-medium">{upload.aiReport.type}</span>
                                    </div>
                                    <div>
                                      <span className="text-silver">Категория:</span>{' '}
                                      <span className="text-foreground font-medium">{upload.aiReport.category}</span>
                                    </div>
                                    <div>
                                      <span className="text-silver">Позиций:</span>{' '}
                                      <span className="text-foreground font-medium">{upload.aiReport.itemsFound}</span>
                                    </div>
                                    <div>
                                      <span className="text-silver">Качество:</span>{' '}
                                      <span className="text-foreground font-medium">{upload.aiReport.quality}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-silver mb-2">{upload.aiReport.details}</p>
                                  <div className="flex items-center gap-2 mt-3">
                                    <Icon name="Lightbulb" className="w-4 h-4 text-gold" />
                                    <span className="text-sm font-semibold text-gold">
                                      Рекомендация: {upload.aiReport.recommendation}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {upload.status === 'pending' && (
                              <div className="flex gap-3">
                                <Button
                                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover-scale"
                                  onClick={() => handleApproveUpload(upload.id)}
                                >
                                  <Icon name="Check" className="w-4 h-4 mr-2" />
                                  Принять в базу
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                                  onClick={() => handleRejectUpload(upload.id)}
                                >
                                  <Icon name="X" className="w-4 h-4 mr-2" />
                                  Отклонить
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="animate-fade-in space-y-6">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Модерация платежей</CardTitle>
                  <CardDescription className="text-silver">
                    Проверка чеков и активация Premium подписок
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Поиск по имени или email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-md bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={activeFilter === 'all' ? 'default' : 'outline'}
                        className={activeFilter === 'all' ? 'bg-gold text-dark' : 'border-gold/30 text-gold'}
                        onClick={() => setActiveFilter('all')}
                      >
                        Все ({paymentRequests.length})
                      </Button>
                      <Button
                        size="sm"
                        variant={activeFilter === 'pending' ? 'default' : 'outline'}
                        className={activeFilter === 'pending' ? 'bg-yellow-500 text-dark' : 'border-yellow-500/30 text-yellow-500'}
                        onClick={() => setActiveFilter('pending')}
                      >
                        На проверке ({paymentRequests.filter(p => p.status === 'pending').length})
                      </Button>
                      <Button
                        size="sm"
                        variant={activeFilter === 'approved' ? 'default' : 'outline'}
                        className={activeFilter === 'approved' ? 'bg-green-500 text-dark' : 'border-green-500/30 text-green-500'}
                        onClick={() => setActiveFilter('approved')}
                      >
                        Одобрено ({paymentRequests.filter(p => p.status === 'approved').length})
                      </Button>
                      <Button
                        size="sm"
                        variant={activeFilter === 'rejected' ? 'default' : 'outline'}
                        className={activeFilter === 'rejected' ? 'bg-red-500 text-dark' : 'border-red-500/30 text-red-500'}
                        onClick={() => setActiveFilter('rejected')}
                      >
                        Отклонено ({paymentRequests.filter(p => p.status === 'rejected').length})
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredPayments.map((payment) => (
                      <Card key={payment.id} className="bg-dark border-gold/10">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-24 h-32 rounded-lg overflow-hidden border border-gold/20 flex-shrink-0 cursor-pointer hover:border-gold/50 transition-colors"
                              onClick={() => setSelectedReceipt(payment.receiptUrl)}
                            >
                              <img
                                src={payment.receiptUrl}
                                alt="Чек"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-lg font-semibold text-foreground mb-1">
                                    {payment.userName}
                                  </h4>
                                  <p className="text-sm text-silver">{payment.userEmail}</p>
                                </div>
                                <Badge
                                  className={
                                    payment.status === 'pending'
                                      ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                      : payment.status === 'approved'
                                      ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                      : 'bg-red-500/20 text-red-500 border-red-500/30'
                                  }
                                >
                                  {payment.status === 'pending'
                                    ? 'На проверке'
                                    : payment.status === 'approved'
                                    ? 'Одобрено'
                                    : 'Отклонено'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                                <div>
                                  <span className="text-silver">Тариф:</span>{' '}
                                  <span className="text-foreground font-medium">{planNames[payment.plan]}</span>
                                </div>
                                <div>
                                  <span className="text-silver">Сумма:</span>{' '}
                                  <span className="text-gold font-bold">{payment.amount} ₽</span>
                                </div>
                                <div>
                                  <span className="text-silver">Дата:</span>{' '}
                                  <span className="text-foreground font-medium">
                                    {new Date(payment.date).toLocaleDateString('ru-RU')}
                                  </span>
                                </div>
                              </div>
                              {payment.status === 'pending' && (
                                <div className="flex gap-3">
                                  <Button
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white hover-scale"
                                    onClick={() => handleApprovePayment(payment.id)}
                                  >
                                    <Icon name="Check" className="w-4 h-4 mr-2" />
                                    Подтвердить платеж
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleRejectPayment(payment.id)}
                                  >
                                    <Icon name="X" className="w-4 h-4 mr-2" />
                                    Отклонить
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Управление пользователями</CardTitle>
                  <CardDescription className="text-silver">
                    Роли, подписки и статусы пользователей
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="Users" className="w-16 h-16 text-gold mx-auto mb-4" />
                    <p className="text-silver">
                      Раздел управления пользователями в разработке
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-4 -right-4 z-10"
              onClick={() => setSelectedReceipt(null)}
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
            <img
              src={selectedReceipt}
              alt="Чек (увеличено)"
              className="rounded-lg border-2 border-gold/30 max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
