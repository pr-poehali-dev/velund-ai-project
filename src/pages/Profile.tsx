import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Иван Иванов');
  const [userEmail, setUserEmail] = useState('ivan@example.com');
  const [userPhone, setUserPhone] = useState('+7 (900) 123-45-67');
  
  // Mock user data
  const userRole = 'user'; // 'user' | 'premium' | 'admin'
  const subscriptionEndDate = null; // null for free users
  
  const searchHistory = [
    { id: 1, query: 'Круг ст3 20мм', date: '2024-01-20', results: 15 },
    { id: 2, query: 'Лист 10мм', date: '2024-01-19', results: 8 },
    { id: 3, query: 'Труба 100мм', date: '2024-01-18', results: 12 }
  ];

  const paymentHistory = [
    { id: 1, plan: 'Premium на месяц', amount: 1200, date: '2024-01-01', status: 'pending' }
  ];

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
                onClick={() => navigate('/auth')}
              >
                <Icon name="LogOut" className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
              <Icon name="User" className="w-10 h-10 text-dark" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gold">{userName}</h2>
              <p className="text-silver">{userEmail}</p>
            </div>
            <Badge
              className={
                userRole === 'premium'
                  ? 'ml-auto bg-gold/20 text-gold border-gold/30'
                  : userRole === 'admin'
                  ? 'ml-auto bg-gold-dark/20 text-gold-dark border-gold-dark/30'
                  : 'ml-auto bg-silver/20 text-silver border-silver/30'
              }
            >
              <Icon
                name={userRole === 'premium' ? 'Crown' : userRole === 'admin' ? 'Shield' : 'User'}
                className="w-4 h-4 mr-1"
              />
              {userRole === 'premium' ? 'Premium' : userRole === 'admin' ? 'Администратор' : 'Базовый'}
            </Badge>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-dark-lighter border border-gold/20">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="User" className="w-4 h-4 mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="Crown" className="w-4 h-4 mr-2" />
                Подписка
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-gold data-[state=active]:text-dark"
              >
                <Icon name="History" className="w-4 h-4 mr-2" />
                История
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Личные данные</CardTitle>
                  <CardDescription className="text-silver">
                    Управление вашей учетной записью
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Полное имя</label>
                    <Input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Телефон</label>
                    <Input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="bg-dark border-gold/20 focus:border-gold text-foreground"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale">
                    <Icon name="Save" className="w-4 h-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="animate-fade-in space-y-6">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">Текущий тариф</CardTitle>
                  <CardDescription className="text-silver">
                    {userRole === 'premium'
                      ? `Подписка активна до ${subscriptionEndDate}`
                      : 'У вас базовый тариф'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRole !== 'premium' && (
                    <div className="text-center py-8">
                      <Icon name="Crown" className="w-16 h-16 text-gold mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gold mb-2">Обновите до Premium</h3>
                      <p className="text-silver mb-6">
                        Получите неограниченный доступ ко всем функциям платформы
                      </p>
                      <Button
                        className="bg-gradient-to-r from-gold to-gold-dark text-dark hover-scale"
                        onClick={() => navigate('/')}
                      >
                        Выбрать тариф
                      </Button>
                    </div>
                  )}
                  {userRole === 'premium' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gold/20">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                            <Icon name="Crown" className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gold">Premium</h4>
                            <p className="text-sm text-silver">Активна до {subscriptionEndDate}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-gold/30 text-gold hover:bg-gold/10"
                          onClick={() => navigate('/')}
                        >
                          Продлить
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {paymentHistory.length > 0 && (
                <Card className="bg-dark-lighter border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-gold">История платежей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gold/10"
                        >
                          <div>
                            <p className="font-medium text-foreground">{payment.plan}</p>
                            <p className="text-sm text-silver">
                              {new Date(payment.date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gold">{payment.amount} ₽</p>
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
              <Card className="bg-dark-lighter border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold">История поиска</CardTitle>
                  <CardDescription className="text-silver">
                    Ваши последние запросы к AI ассистенту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchHistory.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gold/10 hover:border-gold/30 transition-all hover-scale"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                            <Icon name="Search" className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.query}</p>
                            <p className="text-sm text-silver">
                              {new Date(item.date).toLocaleDateString('ru-RU')} • {item.results}{' '}
                              результатов
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gold/30 text-gold hover:bg-gold/10"
                          onClick={() => navigate('/')}
                        >
                          Повторить
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
