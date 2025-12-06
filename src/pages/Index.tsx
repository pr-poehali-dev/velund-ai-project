import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const mockSuppliers = [
  {
    id: 1,
    name: 'МеталлТрейд',
    city: 'Москва',
    product: 'Круг ст3 20мм',
    price: 52000,
    quantity: 5000,
    type: 'прямой',
    date: '2024-01-15',
    phone: '+7 (495) 123-45-67'
  },
  {
    id: 2,
    name: 'СталПром',
    city: 'Казань',
    product: 'Круг ст3 20мм',
    price: 48500,
    quantity: 3000,
    type: 'прямой',
    date: '2024-01-18',
    phone: '+7 (843) 987-65-43'
  },
  {
    id: 3,
    name: 'ПрокатСервис',
    city: 'Санкт-Петербург',
    product: 'Круг ст3 20мм',
    price: 51000,
    quantity: 8000,
    type: 'перекуп',
    date: '2024-01-12',
    phone: '+7 (812) 555-44-33'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || supplier.city === filterCity;
    const matchesType = filterType === 'all' || supplier.type === filterType;
    return matchesSearch && matchesCity && matchesType;
  });

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
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => setActiveTab('chat')}
              >
                <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
                AI Чат
              </Button>
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => setActiveTab('suppliers')}
              >
                <Icon name="Building2" className="w-4 h-4 mr-2" />
                Поставщики
              </Button>
              <Button
                variant="ghost"
                className="text-silver hover:text-gold transition-colors"
                onClick={() => setActiveTab('upload')}
              >
                <Icon name="Upload" className="w-4 h-4 mr-2" />
                Загрузка
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark font-semibold hover-scale">
                    <Icon name="Crown" className="w-4 h-4 mr-2" />
                    Premium
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-dark-lighter border-gold/30 p-0">
                  <div className="space-y-2 p-4">
                    <h3 className="text-lg font-semibold text-gold mb-3">Выберите тариф</h3>
                    <Card
                      className="bg-dark border-gold/20 hover:border-gold/50 transition-all cursor-pointer hover-scale"
                      onClick={() => navigate('/payment?plan=month')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Calendar" className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gold mb-1">Месяц Безлимит</h4>
                            <p className="text-2xl font-bold text-foreground mb-2">1,200 ₽</p>
                            <ul className="space-y-1 text-sm text-silver">
                              <li className="flex items-center gap-1">
                                <Icon name="Check" className="w-3 h-3 text-gold" />
                                Неограниченные AI запросы
                              </li>
                              <li className="flex items-center gap-1">
                                <Icon name="Check" className="w-3 h-3 text-gold" />
                                Загрузка своих прайсов
                              </li>
                              <li className="flex items-center gap-1">
                                <Icon name="Check" className="w-3 h-3 text-gold" />
                                Экспорт данных
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-dark border-silver/20 hover:border-silver/50 transition-all cursor-pointer hover-scale"
                      onClick={() => navigate('/payment?plan=day')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-silver/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="Clock" className="w-5 h-5 text-silver" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-silver mb-1">День Безлимит</h4>
                            <p className="text-2xl font-bold text-foreground mb-2">150 ₽</p>
                            <ul className="space-y-1 text-sm text-silver">
                              <li className="flex items-center gap-1">
                                <Icon name="Check" className="w-3 h-3 text-silver" />
                                24 часа полного доступа
                              </li>
                              <li className="flex items-center gap-1">
                                <Icon name="Check" className="w-3 h-3 text-silver" />
                                Все функции Premium
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                onClick={() => navigate('/auth')}
              >
                <Icon name="LogIn" className="w-4 h-4 mr-2" />
                Войти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="hidden">
            <TabsTrigger value="chat">Чат</TabsTrigger>
            <TabsTrigger value="suppliers">Поставщики</TabsTrigger>
            <TabsTrigger value="upload">Загрузка</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="animate-fade-in space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-dark-lighter border-gold/20 hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Database" className="w-8 h-8 text-gold" />
                    <Badge className="bg-gold/20 text-gold border-gold/30">Активно</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gold">1,247</CardTitle>
                  <CardDescription className="text-silver">Поставщиков в базе</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-dark-lighter border-silver/20 hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Package" className="w-8 h-8 text-silver" />
                    <Badge className="bg-silver/20 text-silver border-silver/30">Обновлено</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-silver">45,892</CardTitle>
                  <CardDescription className="text-silver">Товарных позиций</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-dark-lighter border-gold/20 hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="FileText" className="w-8 h-8 text-gold-light" />
                    <Badge className="bg-gold-light/20 text-gold-light border-gold-light/30">Сегодня</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gold-light">127</CardTitle>
                  <CardDescription className="text-silver">Прайсов обработано</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-dark-lighter border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Icon name="Bot" className="w-6 h-6" />
                  AI Ассистент GPT-5.1
                </CardTitle>
                <CardDescription className="text-silver">
                  Задайте вопрос о поставщиках, ценах или товарах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-dark rounded-lg p-4 space-y-4 h-[400px] overflow-y-auto">
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                      <Icon name="Bot" className="w-5 h-5 text-dark" />
                    </div>
                    <div className="flex-1 bg-dark-lighter rounded-lg p-3 border border-gold/20">
                      <p className="text-foreground">
                        Привет! Я Velund AI — ваш персональный помощник по металлопрокату. 
                        Могу найти любого поставщика, сравнить цены и проанализировать рынок.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-1" />
                    <div className="flex-1 bg-muted rounded-lg p-3 border border-silver/20">
                      <p className="text-foreground">
                        Нужен круг ст3 20мм в Казани
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-silver to-silver-dark flex items-center justify-center flex-shrink-0">
                      <Icon name="User" className="w-5 h-5 text-dark" />
                    </div>
                  </div>

                  <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                      <Icon name="Bot" className="w-5 h-5 text-dark" />
                    </div>
                    <div className="flex-1 bg-dark-lighter rounded-lg p-3 border border-gold/20">
                      <p className="text-foreground mb-2">
                        Нашёл 3 поставщика круга ст3 20мм в Казани:
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm p-2 bg-dark rounded border border-gold/10">
                          <p className="font-semibold text-gold">СталПром</p>
                          <p className="text-silver">48,500 ₽/тонна • 3 тонны в наличии</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Спросите о поставщиках, ценах или товарах..."
                    className="flex-1 bg-dark border-gold/20 focus:border-gold text-foreground placeholder:text-muted-foreground"
                  />
                  <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale">
                    <Icon name="Send" className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="animate-fade-in space-y-6">
            <Card className="bg-dark-lighter border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="Search" className="w-6 h-6" />
                  База поставщиков
                </CardTitle>
                <CardDescription className="text-silver">
                  Поиск и фильтрация по 1,247 поставщикам
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Поиск по товару..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-dark border-gold/20 focus:border-gold text-foreground"
                  />
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="bg-dark border-gold/20 text-foreground">
                      <SelectValue placeholder="Город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все города</SelectItem>
                      <SelectItem value="Москва">Москва</SelectItem>
                      <SelectItem value="Казань">Казань</SelectItem>
                      <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-dark border-gold/20 text-foreground">
                      <SelectValue placeholder="Тип поставщика" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      <SelectItem value="прямой">Прямой поставщик</SelectItem>
                      <SelectItem value="перекуп">Перекуп</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredSuppliers.map((supplier, index) => (
                    <Card
                      key={supplier.id}
                      className="bg-dark border-gold/10 hover:border-gold/30 transition-all hover-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gold">{supplier.name}</h3>
                              <Badge
                                className={
                                  supplier.type === 'прямой'
                                    ? 'bg-gold/20 text-gold border-gold/30'
                                    : 'bg-silver/20 text-silver border-silver/30'
                                }
                              >
                                {supplier.type}
                              </Badge>
                            </div>
                            <p className="text-foreground font-medium mb-2">{supplier.product}</p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-silver">
                              <div className="flex items-center gap-2">
                                <Icon name="MapPin" className="w-4 h-4" />
                                {supplier.city}
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Phone" className="w-4 h-4" />
                                {supplier.phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Package" className="w-4 h-4" />
                                {supplier.quantity} кг
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" className="w-4 h-4" />
                                {new Date(supplier.date).toLocaleDateString('ru-RU')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gold">
                              {supplier.price.toLocaleString('ru-RU')} ₽
                            </p>
                            <p className="text-sm text-silver">за тонну</p>
                            <Button
                              size="sm"
                              className="mt-3 bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                            >
                              Связаться
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="animate-fade-in">
            <Card className="bg-dark-lighter border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Icon name="Upload" className="w-6 h-6" />
                  Загрузка файлов поставщиков
                </CardTitle>
                <CardDescription className="text-silver">
                  Загружайте прайс-листы, каталоги и документы в форматах PDF, XLSX, DOC, JPG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gold/30 rounded-lg p-12 text-center hover:border-gold/50 transition-colors hover-scale cursor-pointer">
                  <Icon name="Upload" className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gold mb-2">
                    Перетащите файлы сюда
                  </h3>
                  <p className="text-silver mb-4">
                    или нажмите для выбора файлов
                  </p>
                  <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale">
                    Выбрать файлы
                  </Button>
                </div>

                <div className="mt-8 space-y-3">
                  <h4 className="text-lg font-semibold text-silver mb-4">Последние загрузки</h4>
                  {[1, 2, 3].map((item, index) => (
                    <Card
                      key={item}
                      className="bg-dark border-gold/10 hover:border-gold/30 transition-all"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                          <Icon name="FileText" className="w-6 h-6 text-gold" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">прайс_металлопрокат_{item}.xlsx</p>
                          <p className="text-sm text-silver">Загружен 2 часа назад • Обработан</p>
                        </div>
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          <Icon name="Check" className="w-4 h-4 mr-1" />
                          Готово
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-dark-lighter/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-silver">
          <p className="text-sm">
            © 2024 Velund AI 5.1 — Платформа для автоматизации работы с металлопрокатом
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;