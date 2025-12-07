import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CRM = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  const clients = [
    {
      id: 1,
      company: 'ООО "Строймаш"',
      contact: 'Иванов Петр',
      email: 'p.ivanov@stroymash.ru',
      phone: '+7 (495) 123-45-67',
      city: 'Москва',
      status: 'active',
      lastActivity: '2024-01-20',
      totalDeals: 15,
      totalAmount: 4500000
    },
    {
      id: 2,
      company: 'ИП Сидоров',
      contact: 'Сидоров Иван',
      email: 'sidorov@mail.ru',
      phone: '+7 (812) 987-65-43',
      city: 'Санкт-Петербург',
      status: 'potential',
      lastActivity: '2024-01-18',
      totalDeals: 3,
      totalAmount: 850000
    },
    {
      id: 3,
      company: 'АО "МеталлСтрой"',
      contact: 'Петрова Мария',
      email: 'm.petrova@metallstroy.ru',
      phone: '+7 (843) 555-44-33',
      city: 'Казань',
      status: 'active',
      lastActivity: '2024-01-22',
      totalDeals: 28,
      totalAmount: 12300000
    }
  ];

  const clientRequests = [
    {
      id: 1,
      clientId: 1,
      query: 'Нужен лист 3мм 1500х6000',
      date: '2024-01-20',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 2,
      clientId: 1,
      query: 'Труба оцинкованная 57х3',
      date: '2024-01-18',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      clientId: 2,
      query: 'Швеллер 12П, 5 тонн',
      date: '2024-01-15',
      status: 'waiting',
      priority: 'low'
    }
  ];

  const proposals = [
    {
      id: 1,
      clientId: 1,
      title: 'КП №001 - Лист металлический',
      date: '2024-01-20',
      amount: 450000,
      status: 'sent',
      items: 5
    },
    {
      id: 2,
      clientId: 3,
      title: 'КП №002 - Металлопрокат',
      date: '2024-01-22',
      amount: 1200000,
      status: 'approved',
      items: 12
    }
  ];

  const handleGenerateProposal = (clientId: number) => {
    toast.success('Создаю коммерческое предложение...', {
      description: 'PDF будет готов через несколько секунд'
    });

    setTimeout(() => {
      toast.success('КП успешно создано!', {
        description: 'Файл доступен для скачивания'
      });
    }, 2000);
  };

  const handleSendEmail = (clientId: number) => {
    toast.success('Письмо отправлено!', {
      description: 'Клиент получит уведомление на email'
    });
  };

  const selectedClientData = selectedClient ? clients.find(c => c.id === selectedClient) : null;
  const selectedClientRequests = selectedClient ? clientRequests.filter(r => r.clientId === selectedClient) : [];
  const selectedClientProposals = selectedClient ? proposals.filter(p => p.clientId === selectedClient) : [];

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
                Velund AI CRM
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="LayoutDashboard" className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" className="w-4 h-4 mr-2" />
                Главная
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gold">CRM — Мои клиенты</h2>
              <p className="text-silver">Управление клиентами и сделками</p>
            </div>
            <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale">
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Добавить клиента
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-dark-lighter border-gold/20 hover-scale animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="Users" className="w-8 h-8 text-gold" />
                </div>
                <CardTitle className="text-2xl font-bold text-gold">{clients.length}</CardTitle>
                <CardDescription className="text-silver">Всего клиентов</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.05s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="CheckCircle" className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-500">
                  {clients.filter(c => c.status === 'active').length}
                </CardTitle>
                <CardDescription className="text-silver">Активных</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-blue-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="FileText" className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-500">{proposals.length}</CardTitle>
                <CardDescription className="text-silver">КП отправлено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="DollarSign" className="w-8 h-8 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-yellow-500">
                  {(clients.reduce((sum, c) => sum + c.totalAmount, 0) / 1000000).toFixed(1)}М ₽
                </CardTitle>
                <CardDescription className="text-silver">Общий оборот</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="Users" className="w-6 h-6" />
                  Список клиентов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-3 rounded-lg border transition-all hover-scale cursor-pointer ${
                        selectedClient === client.id
                          ? 'bg-gold/10 border-gold'
                          : 'bg-dark border-gold/10 hover:border-gold/30'
                      }`}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{client.company}</p>
                          <p className="text-xs text-silver">{client.contact}</p>
                        </div>
                        <Badge
                          className={
                            client.status === 'active'
                              ? 'bg-green-500/20 text-green-500 border-green-500/30 text-xs'
                              : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-xs'
                          }
                        >
                          {client.status === 'active' ? 'Активен' : 'Потенциал'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-silver">
                        <Icon name="MapPin" className="w-3 h-3" />
                        {client.city}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              {!selectedClientData ? (
                <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.25s' }}>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Icon name="Users" className="w-16 h-16 text-gold mb-4" />
                    <p className="text-silver">Выберите клиента для просмотра деталей</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.25s' }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-gold">{selectedClientData.company}</CardTitle>
                          <CardDescription className="text-silver mt-1">
                            {selectedClientData.contact}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            selectedClientData.status === 'active'
                              ? 'bg-green-500/20 text-green-500 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                          }
                        >
                          {selectedClientData.status === 'active' ? 'Активный клиент' : 'Потенциальный'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-silver mb-1">Email</p>
                          <p className="text-sm text-foreground">{selectedClientData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-silver mb-1">Телефон</p>
                          <p className="text-sm text-foreground">{selectedClientData.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-silver mb-1">Город</p>
                          <p className="text-sm text-foreground">{selectedClientData.city}</p>
                        </div>
                        <div>
                          <p className="text-xs text-silver mb-1">Последняя активность</p>
                          <p className="text-sm text-foreground">
                            {new Date(selectedClientData.lastActivity).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/20">
                        <div className="text-center p-3 bg-dark rounded-lg">
                          <p className="text-2xl font-bold text-gold">{selectedClientData.totalDeals}</p>
                          <p className="text-xs text-silver mt-1">Сделок</p>
                        </div>
                        <div className="text-center p-3 bg-dark rounded-lg">
                          <p className="text-2xl font-bold text-gold">
                            {(selectedClientData.totalAmount / 1000000).toFixed(1)}М ₽
                          </p>
                          <p className="text-xs text-silver mt-1">Общая сумма</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                          onClick={() => handleGenerateProposal(selectedClientData.id)}
                        >
                          <Icon name="FileText" className="w-4 h-4 mr-2" />
                          Создать КП
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
                          onClick={() => handleSendEmail(selectedClientData.id)}
                        >
                          <Icon name="Mail" className="w-4 h-4 mr-2" />
                          Написать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="requests" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <TabsList className="grid w-full grid-cols-2 bg-dark-lighter border border-gold/20">
                      <TabsTrigger
                        value="requests"
                        className="data-[state=active]:bg-gold data-[state=active]:text-dark"
                      >
                        <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
                        Запросы
                      </TabsTrigger>
                      <TabsTrigger
                        value="proposals"
                        className="data-[state=active]:bg-gold data-[state=active]:text-dark"
                      >
                        <Icon name="FileText" className="w-4 h-4 mr-2" />
                        КП
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="requests" className="space-y-2">
                      <Card className="bg-dark-lighter border-gold/20">
                        <CardHeader>
                          <CardTitle className="text-gold text-lg">История запросов</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedClientRequests.length === 0 ? (
                            <p className="text-center text-silver py-6">Нет запросов</p>
                          ) : (
                            <div className="space-y-2">
                              {selectedClientRequests.map((request) => (
                                <div
                                  key={request.id}
                                  className="p-3 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-all"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm text-foreground font-medium">{request.query}</p>
                                    <Badge
                                      className={
                                        request.status === 'completed'
                                          ? 'bg-green-500/20 text-green-500 border-green-500/30 text-xs'
                                          : request.status === 'in_progress'
                                          ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-xs'
                                          : 'bg-blue-500/20 text-blue-500 border-blue-500/30 text-xs'
                                      }
                                    >
                                      {request.status === 'completed'
                                        ? 'Выполнено'
                                        : request.status === 'in_progress'
                                        ? 'В работе'
                                        : 'Ожидает'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-silver">
                                    <span>{new Date(request.date).toLocaleDateString('ru-RU')}</span>
                                    <Badge
                                      className={
                                        request.priority === 'high'
                                          ? 'bg-red-500/20 text-red-500 border-red-500/30'
                                          : request.priority === 'medium'
                                          ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                          : 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                                      }
                                    >
                                      {request.priority === 'high'
                                        ? 'Высокий'
                                        : request.priority === 'medium'
                                        ? 'Средний'
                                        : 'Низкий'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="proposals" className="space-y-2">
                      <Card className="bg-dark-lighter border-gold/20">
                        <CardHeader>
                          <CardTitle className="text-gold text-lg">Коммерческие предложения</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedClientProposals.length === 0 ? (
                            <p className="text-center text-silver py-6">Нет КП</p>
                          ) : (
                            <div className="space-y-2">
                              {selectedClientProposals.map((proposal) => (
                                <div
                                  key={proposal.id}
                                  className="p-3 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-all"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="text-sm text-foreground font-medium">{proposal.title}</p>
                                      <p className="text-xs text-silver mt-1">
                                        {new Date(proposal.date).toLocaleDateString('ru-RU')} • {proposal.items}{' '}
                                        позиций
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        proposal.status === 'approved'
                                          ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                          : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                      }
                                    >
                                      {proposal.status === 'approved' ? 'Одобрено' : 'Отправлено'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gold/10">
                                    <p className="text-lg font-bold text-gold">
                                      {proposal.amount.toLocaleString('ru-RU')} ₽
                                    </p>
                                    <Button size="sm" variant="outline" className="border-gold/30 text-gold">
                                      <Icon name="Download" className="w-4 h-4 mr-1" />
                                      Скачать
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CRM;
