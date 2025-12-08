import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddSupplierForm from '@/components/dashboard/AddSupplierForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('velund_user');
    if (!user) {
      navigate('/auth');
    }
  }, [navigate]);

  const todayTasks = [
    { id: 1, title: 'Связаться с СталПром', time: '10:00', priority: 'high', done: false },
    { id: 2, title: 'Отправить КП клиенту ООО "Строймаш"', time: '14:00', priority: 'medium', done: false },
    { id: 3, title: 'Проверить новый прайс МеталлТрейд', time: '16:30', priority: 'low', done: true }
  ];

  const recentPrices = [
    { id: 1, supplier: 'СталПром', city: 'Казань', items: 145, date: '2 часа назад', change: '+3%' },
    { id: 2, supplier: 'МеталлТрейд', city: 'Москва', items: 89, date: '5 часов назад', change: '-1%' },
    { id: 3, supplier: 'ПрокатСервис', city: 'СПб', items: 234, date: 'Вчера', change: '+5%' }
  ];

  const topCheap = [
    { id: 1, product: 'Круг ст3 20мм', supplier: 'СталПром', price: 48500, city: 'Казань' },
    { id: 2, product: 'Лист 3мм 09Г2С', supplier: 'Металлист', price: 67000, city: 'Москва' },
    { id: 3, product: 'Труба 57х3', supplier: 'ТрубПром', price: 52000, city: 'Казань' },
    { id: 4, product: 'Швеллер 12П', supplier: 'ПрокатСервис', price: 58000, city: 'СПб' },
    { id: 5, product: 'Уголок 50х50х5', supplier: 'МеталлТрейд', price: 51000, city: 'Москва' }
  ];

  const notifications = [
    { id: 1, text: 'Новый поставщик труб 20мм в Казани', time: '10 мин назад', type: 'new' },
    { id: 2, text: 'Цена на лист 3мм упала на 5%', time: '1 час назад', type: 'price' },
    { id: 3, text: 'СталПром обновил прайс', time: '2 часа назад', type: 'update' }
  ];

  const aiSuggestions = [
    'Кто в Казани продает швеллер 12П?',
    'Средняя цена на лист 09Г2С 4мм в Москве?',
    'Покажи прямых поставщиков нержавейки',
    'Топ-5 дешевых труб профильных 40х40'
  ];

  const handleAiQuery = () => {
    if (!aiQuery.trim()) {
      toast.error('Введите запрос');
      return;
    }

    toast.success('AI ищет ответ...', {
      description: 'Анализирую базу поставщиков'
    });

    setTimeout(() => {
      toast.success('Найдено 3 варианта!', {
        description: 'Результаты готовы в разделе поиска'
      });
      setAiQuery('');
    }, 2000);
  };

  const stats = {
    suppliers: 1247,
    products: 45892,
    todayPrices: 127,
    activeTasks: todayTasks.filter(t => !t.done).length
  };

  return (
    <div className="min-h-screen bg-dark">
      <header className="border-b border-border bg-dark-lighter/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold via-gold-light to-silver rounded-lg flex items-center justify-center pulse-gold">
                <Icon name="Hammer" className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-montserrat text-gradient-gold">
                  Velund AI MetalDesk
                </h1>
                <p className="text-xs text-silver">Рабочее место менеджера</p>
              </div>
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
              <Badge className="bg-gold/20 text-gold border-gold/30">
                <Icon name="Briefcase" className="w-4 h-4 mr-1" />
                Менеджер
              </Badge>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gold">Добрый день! 👋</h2>
              <p className="text-silver">У вас {stats.activeTasks} задачи на сегодня</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-silver">Сегодня</p>
              <p className="text-lg font-bold text-foreground">
                {new Date().toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            <Card className="bg-dark-lighter border-gold/20 hover-scale gold-glow-hover animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="Database" className="w-8 h-8 text-gold" />
                  <Badge className="bg-gold/20 text-gold border-gold/30">Активно</Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-gold">{stats.suppliers}</CardTitle>
                <CardDescription className="text-silver">Поставщиков в базе</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-silver/20 hover-scale silver-glow-hover animate-fade-in" style={{ animationDelay: '0.05s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="Package" className="w-8 h-8 text-silver" />
                  <Badge className="bg-silver/20 text-silver border-silver/30">Товаров</Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-silver">{stats.products.toLocaleString()}</CardTitle>
                <CardDescription className="text-silver">Позиций в каталоге</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-green-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="FileText" className="w-8 h-8 text-green-500" />
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Сегодня</Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-green-500">{stats.todayPrices}</CardTitle>
                <CardDescription className="text-silver">Прайсов обновлено</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-dark-lighter border-yellow-500/20 hover-scale animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon name="CheckSquare" className="w-8 h-8 text-yellow-500" />
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Задачи</Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-yellow-500">{stats.activeTasks}</CardTitle>
                <CardDescription className="text-silver">Активных задач</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Icon name="Bot" className="w-6 h-6" />
                    Спроси у Velund AI
                  </CardTitle>
                  <CardDescription className="text-silver">
                    Умный помощник по поиску поставщиков и ценам
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Например: Кто в Казани продает швеллер 12П?"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                    <Button 
                      className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                      onClick={handleAiQuery}
                    >
                      <Icon name="Send" className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-silver font-semibold">Популярные запросы:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="border-gold/20 text-silver hover:bg-gold/10 hover:text-gold text-xs"
                          onClick={() => setAiQuery(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Icon name="TrendingDown" className="w-6 h-6" />
                    Топ-5 дешевых позиций недели
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topCheap.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-all hover-scale"
                      >
                        <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{item.product}</p>
                          <p className="text-xs text-silver">{item.supplier} • {item.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gold">{item.price.toLocaleString()} ₽</p>
                          <p className="text-xs text-silver">за тонну</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                          <Icon name="Phone" className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-dark-lighter border-yellow-500/20 animate-fade-in" style={{ animationDelay: '0.25s' }}>
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Icon name="CheckSquare" className="w-6 h-6" />
                    Мои задачи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border transition-all hover-scale cursor-pointer ${
                          task.done
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-dark border-yellow-500/20 hover:border-yellow-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            task.done ? 'bg-green-500 border-green-500' : 'border-yellow-500'
                          }`}>
                            {task.done && <Icon name="Check" className="w-3 h-3 text-dark" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${task.done ? 'text-green-500 line-through' : 'text-foreground'}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-silver">{task.time}</p>
                              <Badge
                                className={
                                  task.priority === 'high'
                                    ? 'bg-red-500/20 text-red-500 border-red-500/30 text-xs'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-xs'
                                    : 'bg-blue-500/20 text-blue-500 border-blue-500/30 text-xs'
                                }
                              >
                                {task.priority === 'high' ? 'Важно' : task.priority === 'medium' ? 'Средне' : 'Низко'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-lighter border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="text-blue-500 flex items-center gap-2">
                    <Icon name="Bell" className="w-6 h-6" />
                    Уведомления
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 bg-dark rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all hover-scale cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon
                              name={notif.type === 'new' ? 'Plus' : notif.type === 'price' ? 'TrendingDown' : 'RefreshCw'}
                              className="w-4 h-4 text-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{notif.text}</p>
                            <p className="text-xs text-silver mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-lighter border-green-500/20 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <CardHeader>
                  <CardTitle className="text-green-500 flex items-center gap-2">
                    <Icon name="RefreshCw" className="w-6 h-6" />
                    Последние прайсы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentPrices.map((price) => (
                      <div
                        key={price.id}
                        className="p-3 bg-dark rounded-lg border border-green-500/20 hover:border-green-500/50 transition-all hover-scale"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-foreground text-sm">{price.supplier}</p>
                          <Badge className={
                            price.change.startsWith('+')
                              ? 'bg-red-500/20 text-red-500 border-red-500/30 text-xs'
                              : 'bg-green-500/20 text-green-500 border-green-500/30 text-xs'
                          }>
                            {price.change}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-silver">
                          <span>{price.city} • {price.items} поз.</span>
                          <span>{price.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <AddSupplierForm onSuccess={() => toast.success('Заявка отправлена!')} />
          </div>

          <Card className="bg-dark-lighter border-gold/20 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <CardHeader>
              <CardTitle className="text-gold">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  className="h-auto py-4 flex-col gap-2 bg-dark border border-gold/20 hover:bg-gold/10 hover:border-gold/50 text-foreground"
                  onClick={() => navigate('/')}
                >
                  <Icon name="Search" className="w-6 h-6 text-gold" />
                  <span className="text-sm">Умный поиск</span>
                </Button>
                <Button
                  className="h-auto py-4 flex-col gap-2 bg-dark border border-gold/20 hover:bg-gold/10 hover:border-gold/50 text-foreground"
                  onClick={() => toast.info('CRM модуль в разработке')}
                >
                  <Icon name="Users" className="w-6 h-6 text-gold" />
                  <span className="text-sm">Мои клиенты</span>
                </Button>
                <Button
                  className="h-auto py-4 flex-col gap-2 bg-dark border border-gold/20 hover:bg-gold/10 hover:border-gold/50 text-foreground"
                  onClick={() => toast.info('Генератор КП в разработке')}
                >
                  <Icon name="FileText" className="w-6 h-6 text-gold" />
                  <span className="text-sm">Создать КП</span>
                </Button>
                <Button
                  className="h-auto py-4 flex-col gap-2 bg-dark border border-gold/20 hover:bg-gold/10 hover:border-gold/50 text-foreground"
                  onClick={() => toast.info('Аналитика в разработке')}
                >
                  <Icon name="BarChart3" className="w-6 h-6 text-gold" />
                  <span className="text-sm">Аналитика</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;