import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
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
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleApprove = (paymentId: number) => {
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'approved' as const } : payment
      )
    );
    alert('Платеж подтвержден! Пользователю открыт доступ.');
  };

  const handleReject = (paymentId: number) => {
    const reason = prompt('Причина отклонения (опционально):');
    setPaymentRequests(prev =>
      prev.map(payment =>
        payment.id === paymentId ? { ...payment, status: 'rejected' as const } : payment
      )
    );
    alert(`Платеж отклонен.${reason ? ` Причина: ${reason}` : ''}`);
  };

  const filteredPayments = paymentRequests.filter(payment => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: paymentRequests.filter(p => p.status === 'pending').length,
    approved: paymentRequests.filter(p => p.status === 'approved').length,
    rejected: paymentRequests.filter(p => p.status === 'rejected').length,
    totalRevenue: paymentRequests
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0)
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
            <p className="text-silver">Управление платежами и подписками пользователей</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="Clock" className="w-8 h-8 text-yellow-500" />
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    На проверке
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-yellow-500">{stats.pending}</CardTitle>
                <CardDescription className="text-silver">Платежей ожидают</CardDescription>
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
                <CardTitle className="text-2xl font-bold text-green-500">{stats.approved}</CardTitle>
                <CardDescription className="text-silver">Платежей подтверждено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-red-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon name="XCircle" className="w-8 h-8 text-red-500" />
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Отклонено</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-red-500">{stats.rejected}</CardTitle>
                <CardDescription className="text-silver">Платежей отклонено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
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

          <Tabs defaultValue="payments" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-dark-lighter border border-gold/20">
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Receipt" className="w-4 h-4 mr-2" />
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

            <TabsContent value="payments" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Заявки на оплату</CardTitle>
                  <CardDescription className="text-silver">
                    Проверяйте и подтверждайте платежи пользователей
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Поиск по имени или email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        className={
                          filterStatus === 'all'
                            ? 'bg-gold text-dark'
                            : 'border-gold/30 text-gold hover:bg-gold/10'
                        }
                        onClick={() => setFilterStatus('all')}
                      >
                        Все
                      </Button>
                      <Button
                        variant={filterStatus === 'pending' ? 'default' : 'outline'}
                        className={
                          filterStatus === 'pending'
                            ? 'bg-yellow-500 text-dark'
                            : 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                        }
                        onClick={() => setFilterStatus('pending')}
                      >
                        На проверке
                      </Button>
                      <Button
                        variant={filterStatus === 'approved' ? 'default' : 'outline'}
                        className={
                          filterStatus === 'approved'
                            ? 'bg-green-500 text-dark'
                            : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                        }
                        onClick={() => setFilterStatus('approved')}
                      >
                        Одобрено
                      </Button>
                      <Button
                        variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                        className={
                          filterStatus === 'rejected'
                            ? 'bg-red-500 text-dark'
                            : 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                        }
                        onClick={() => setFilterStatus('rejected')}
                      >
                        Отклонено
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredPayments.map((payment, index) => (
                      <Card
                        key={payment.id}
                        className="bg-dark border-gold/10 hover:border-gold/30 transition-all"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className="w-24 h-32 bg-dark-lighter rounded-lg overflow-hidden cursor-pointer hover-scale flex-shrink-0"
                              onClick={() => setSelectedReceipt(payment.receiptUrl)}
                            >
                              <img
                                src={payment.receiptUrl}
                                alt="Receipt"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h4 className="text-lg font-semibold text-gold">
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
                                    ? 'Подтверждено'
                                    : 'Отклонено'}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-silver mb-3">
                                <div className="flex items-center gap-2">
                                  <Icon name="Package" className="w-4 h-4" />
                                  {planNames[payment.plan]}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="DollarSign" className="w-4 h-4" />
                                  {payment.amount} ₽
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" className="w-4 h-4" />
                                  {new Date(payment.date).toLocaleString('ru-RU')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="User" className="w-4 h-4" />
                                  ID: {payment.userId}
                                </div>
                              </div>
                              {payment.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleApprove(payment.id)}
                                  >
                                    <Icon name="Check" className="w-4 h-4 mr-1" />
                                    Подтвердить
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(payment.id)}
                                  >
                                    <Icon name="X" className="w-4 h-4 mr-1" />
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
                    Просмотр и управление учетными записями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-silver py-8">
                    Функция в разработке. Здесь будет список всех пользователей с возможностью
                    редактирования ролей и подписок.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] animate-scale-in">
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-4 -right-4 z-10"
              onClick={() => setSelectedReceipt(null)}
            >
              <Icon name="X" className="w-5 h-5" />
            </Button>
            <img
              src={selectedReceipt}
              alt="Receipt full view"
              className="max-w-full max-h-[90vh] rounded-lg border-2 border-gold/30"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
